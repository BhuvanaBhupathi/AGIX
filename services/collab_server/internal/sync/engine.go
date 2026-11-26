// Package sync implements Conflict-free Replicated Data Types (CRDT) for multi-designer canvas manipulation.
package sync

import (
	"sync"
	"time"
)

type OperationType string

const (
	OpInsertElement OperationType = "insert"
	OpUpdateElement OperationType = "update"
	OpDeleteElement OperationType = "delete"
	OpLayerReorder  OperationType = "reorder"
)

type CanvasOperation struct {
	ID        string        `json:"id"`
	Type      OperationType `json:"type"`
	ActorID   string        `json:"actor_id"`
	TargetID  string        `json:"target_id"`
	Version   uint64        `json:"version"`
	Timestamp int64         `json:"timestamp"`
	Data      []byte        `json:"data"`
}

type CRDTEngine struct {
	operations map[string]CanvasOperation
	versions   map[string]uint64
	mutex      sync.RWMutex
}

func NewCRDTEngine() *CRDTEngine {
	return &CRDTEngine{
		operations: make(map[string]CanvasOperation),
		versions:   make(map[string]uint64),
	}
}

func (e *CRDTEngine) ApplyOperation(op CanvasOperation) (bool, uint64) {
	e.mutex.Lock()
	defer e.mutex.Unlock()

	currentVersion := e.versions[op.TargetID]
	if op.Version <= currentVersion && op.Type == OpUpdateElement {
		// Concurrent conflict: Resolve using Last-Write-Wins (LWW) timestamp rule
		existing, ok := e.operations[op.TargetID]
		if ok && existing.Timestamp >= op.Timestamp {
			return false, currentVersion
		}
	}

	newVersion := currentVersion + 1
	op.Version = newVersion
	op.Timestamp = time.Now().UnixNano()
	e.operations[op.TargetID] = op
	e.versions[op.TargetID] = newVersion

	return true, newVersion
}

func (e *CRDTEngine) GetState(targetID string) (CanvasOperation, bool) {
	e.mutex.RLock()
	defer e.mutex.RUnlock()
	op, ok := e.operations[targetID]
	return op, ok
}
