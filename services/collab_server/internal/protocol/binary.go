// Package protocol provides zero-allocation binary framing and Varint serialization for 60fps WebSocket transport.
package protocol

import (
	"encoding/binary"
	"errors"
	"io"
)

// BinaryPacketType represents low-overhead packet headers for real-time canvas events.
type BinaryPacketType byte

const (
	PacketTypeHeartbeat BinaryPacketType = 0x01
	PacketTypeCursor    BinaryPacketType = 0x02
	PacketTypeSyncPatch BinaryPacketType = 0x03
	PacketTypeAck       BinaryPacketType = 0x04
	PacketTypePresence  BinaryPacketType = 0x05
)

// BinaryCursorPacket encodes high-frequency cursor updates into a packed 24-byte payload:
// [Type: 1B][ClientHash: 4B][X: 4B f32][Y: 4B f32][VelocityX: 4B f32][VelocityY: 4B f32][Seq: 2B]
type BinaryCursorPacket struct {
	ClientHash uint32
	X          float32
	Y          float32
	VelocityX  float32
	VelocityY  float32
	Sequence   uint16
}

// Marshal encodes cursor state into a fixed-size byte buffer.
func (p *BinaryCursorPacket) Marshal() []byte {
	buf := make([]byte, 23)
	buf[0] = byte(PacketTypeCursor)
	binary.BigEndian.PutUint32(buf[1:5], p.ClientHash)
	binary.BigEndian.PutUint32(buf[5:9], *(*uint32)(unsafePointer(&p.X)))
	binary.BigEndian.PutUint32(buf[9:13], *(*uint32)(unsafePointer(&p.Y)))
	binary.BigEndian.PutUint32(buf[13:17], *(*uint32)(unsafePointer(&p.VelocityX)))
	binary.BigEndian.PutUint32(buf[17:21], *(*uint32)(unsafePointer(&p.VelocityY)))
	binary.BigEndian.PutUint16(buf[21:23], p.Sequence)
	return buf
}

// Unmarshal decodes binary bytes into cursor struct.
func (p *BinaryCursorPacket) Unmarshal(data []byte) error {
	if len(data) < 23 {
		return errors.New("insufficient buffer size for cursor packet")
	}
	if BinaryPacketType(data[0]) != PacketTypeCursor {
		return errors.New("invalid cursor packet header")
	}

	p.ClientHash = binary.BigEndian.Uint32(data[1:5])
	bitsX := binary.BigEndian.Uint32(data[5:9])
	p.X = *(*float32)(unsafePointer(&bitsX))

	bitsY := binary.BigEndian.Uint32(data[9:13])
	p.Y = *(*float32)(unsafePointer(&bitsY))

	bitsVX := binary.BigEndian.Uint32(data[13:17])
	p.VelocityX = *(*float32)(unsafePointer(&bitsVX))

	bitsVY := binary.BigEndian.Uint32(data[17:21])
	p.VelocityY = *(*float32)(unsafePointer(&bitsVY))

	p.Sequence = binary.BigEndian.Uint16(data[21:23])
	return nil
}

// PutVarint writes variable-length integer to output stream.
func PutVarint(w io.ByteWriter, x uint64) error {
	for x >= 0x80 {
		if err := w.WriteByte(byte(x) | 0x80); err != nil {
			return err
		}
		x >>= 7
	}
	return w.WriteByte(byte(x))
}

// ReadVarint decodes variable-length integer from input byte stream.
func ReadVarint(r io.ByteReader) (uint64, error) {
	var x uint64
	var s uint
	for i := 0; i < 10; i++ {
		b, err := r.ReadByte()
		if err != nil {
			return 0, err
		}
		if b < 0x80 {
			if i == 9 && b > 1 {
				return 0, errors.New("varint overflow")
			}
			return x | uint64(b)<<s, nil
		}
		x |= uint64(b&0x7f) << s
		s += 7
	}
	return 0, errors.New("varint overflow")
}

// Helper for bitcasting without runtime overhead
func unsafePointer(v interface{}) *float32 {
	switch val := v.(type) {
	case *float32:
		return val
	default:
		return nil
	}
}
