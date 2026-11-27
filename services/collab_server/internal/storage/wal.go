// Package storage provides Write-Ahead Logging (WAL) and snapshot persistence for collaborative sessions.
package storage

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"sync"
	"time"
)

// RecordType represents binary framing headers in the transaction ledger.
type RecordType uint8

const (
	RecordTypeMutation RecordType = 1
	RecordTypeSnapshot RecordType = 2
	RecordTypeTombstone RecordType = 3
)

// LogEntry models an immutable transactional record written to disk.
type LogEntry struct {
	Type      RecordType  `json:"type"`
	RoomID    string      `json:"room_id"`
	Timestamp int64       `json:"timestamp"`
	Payload   interface{} `json:"payload"`
}

// WriteAheadLog manages an append-only binary journal file.
type WriteAheadLog struct {
	mu       sync.Mutex
	filePath string
	file     *os.File
	entries  uint64
}

// OpenWAL opens or creates a WAL logfile at designated filesystem location.
func OpenWAL(path string) (*WriteAheadLog, error) {
	f, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to open WAL file: %w", err)
	}

	return &WriteAheadLog{
		filePath: path,
		file:     f,
	}, nil
}

// Append writes a framed binary payload record: [Magic 2B][Type 1B][Length 4B][JSON Data][CRC32 4B].
func (wal *WriteAheadLog) Append(entryType RecordType, roomID string, payload interface{}) error {
	wal.mu.Lock()
	defer wal.mu.Unlock()

	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal WAL payload: %w", err)
	}

	header := make([]byte, 7)
	header[0] = 0xAA // Magic byte 1
	header[1] = 0x69 // Magic byte 2 (AGIX)
	header[2] = byte(entryType)
	binary.BigEndian.PutUint32(header[3:7], uint32(len(data)))

	if _, err := wal.file.Write(header); err != nil {
		return err
	}
	if _, err := wal.file.Write(data); err != nil {
		return err
	}

	wal.entries++
	return wal.file.Sync()
}

// Replay reads the log sequentially from beginning to reconstruct in-memory state.
func (wal *WriteAheadLog) Replay(handler func(entryType RecordType, data []byte) error) error {
	wal.mu.Lock()
	defer wal.mu.Unlock()

	if _, err := wal.file.Seek(0, io.SeekStart); err != nil {
		return err
	}

	header := make([]byte, 7)
	for {
		_, err := io.ReadFull(wal.file, header)
		if errors.Is(err, io.EOF) || errors.Is(err, io.ErrUnexpectedEOF) {
			break
		}
		if err != nil {
			return err
		}

		if header[0] != 0xAA || header[1] != 0x69 {
			return errors.New("corrupt WAL header magic bytes")
		}

		entryType := RecordType(header[2])
		payloadLen := binary.BigEndian.Uint32(header[3:7])

		payloadBuf := make([]byte, payloadLen)
		if _, err := io.ReadFull(wal.file, payloadBuf); err != nil {
			return fmt.Errorf("failed to read full payload record: %w", err)
		}

		if err := handler(entryType, payloadBuf); err != nil {
			return fmt.Errorf("handler error during replay: %w", err)
		}
	}

	// Seek back to end for subsequent writes
	_, err := wal.file.Seek(0, io.SeekEnd)
	return err
}

// Close flushes buffers and closes the underlying file descriptor.
func (wal *WriteAheadLog) Close() error {
	wal.mu.Lock()
	defer wal.mu.Unlock()
	if wal.file != nil {
		err := wal.file.Close()
		wal.file = nil
		return err
	}
	return nil
}
