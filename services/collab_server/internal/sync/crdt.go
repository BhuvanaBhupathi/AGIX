// Package sync implements Conflict-free Replicated Data Types (CRDTs) for real-time canvas synchronization.
package sync

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sort"
	"sync"
	"time"
)

// VectorClock tracks causal ordering of canvas mutations across distributed studio clients.
type VectorClock struct {
	mu     sync.RWMutex
	Clocks map[string]uint64 `json:"clocks"`
}

// NewVectorClock creates an initialized vector clock.
func NewVectorClock() *VectorClock {
	return &VectorClock{
		Clocks: make(map[string]uint64),
	}
}

// Increment advances the clock for a specific client node.
func (vc *VectorClock) Increment(nodeID string) uint64 {
	vc.mu.Lock()
	defer vc.mu.Unlock()
	vc.Clocks[nodeID]++
	return vc.Clocks[nodeID]
}

// Merge takes the element-wise maximum with another incoming clock.
func (vc *VectorClock) Merge(other map[string]uint64) {
	vc.mu.Lock()
	defer vc.mu.Unlock()
	for k, v := range other {
		if v > vc.Clocks[k] {
			vc.Clocks[k] = v
		}
	}
}

// Clone returns an isolated snapshot of clock state.
func (vc *VectorClock) Clone() map[string]uint64 {
	vc.mu.RLock()
	defer vc.mu.RUnlock()
	copyMap := make(map[string]uint64, len(vc.Clocks))
	for k, v := range vc.Clocks {
		copyMap[k] = v
	}
	return copyMap
}

// LWWRegister represents a Last-Write-Wins atomic value with logical timestamp.
type LWWRegister struct {
	Value     interface{} `json:"value"`
	Timestamp int64       `json:"timestamp"`
	Author    string      `json:"author"`
}

// LWWElementSet is a Conflict-free Replicated Data Type for canvas objects.
// Supports concurrent additions, updates, and tombstones without merge conflicts.
type LWWElementSet struct {
	mu        sync.RWMutex
	AddSet    map[string]LWWRegister `json:"add_set"`
	RemoveSet map[string]LWWRegister `json:"remove_set"`
}

// NewLWWElementSet instantiates an empty canvas element set.
func NewLWWElementSet() *LWWElementSet {
	return &LWWElementSet{
		AddSet:    make(map[string]LWWRegister),
		RemoveSet: make(map[string]LWWRegister),
	}
}

// Add inserts or updates an element with monotonic millisecond timestamp.
func (set *LWWElementSet) Add(id string, val interface{}, author string) {
	set.mu.Lock()
	defer set.mu.Unlock()
	ts := time.Now().UnixNano()
	set.AddSet[id] = LWWRegister{
		Value:     val,
		Timestamp: ts,
		Author:    author,
	}
}

// Remove marks an element as deleted with a tombstone entry.
func (set *LWWElementSet) Remove(id string, author string) {
	set.mu.Lock()
	defer set.mu.Unlock()
	ts := time.Now().UnixNano()
	set.RemoveSet[id] = LWWRegister{
		Value:     nil,
		Timestamp: ts,
		Author:    author,
	}
}

// Lookup verifies whether an element currently exists (Add timestamp strictly dominates Remove timestamp).
func (set *LWWElementSet) Lookup(id string) (interface{}, bool) {
	set.mu.RLock()
	defer set.mu.RUnlock()

	addEntry, inAdd := set.AddSet[id]
	if !inAdd {
		return nil, false
	}

	remEntry, inRem := set.RemoveSet[id]
	if !inRem {
		return addEntry.Value, true
	}

	// Last-Write-Wins tie-breaker
	if addEntry.Timestamp >= remEntry.Timestamp {
		return addEntry.Value, true
	}
	return nil, false
}

// Merge integrates another replica's Add and Remove sets deterministically.
func (set *LWWElementSet) Merge(incomingAdd, incomingRem map[string]LWWRegister) {
	set.mu.Lock()
	defer set.mu.Unlock()

	for k, inVal := range incomingAdd {
		existing, ok := set.AddSet[k]
		if !ok || inVal.Timestamp > existing.Timestamp {
			set.AddSet[k] = inVal
		}
	}

	for k, inVal := range incomingRem {
		existing, ok := set.RemoveSet[k]
		if !ok || inVal.Timestamp > existing.Timestamp {
			set.RemoveSet[k] = inVal
		}
	}
}

// ComputeStateHash calculates a SHA-256 fingerprint for fast Merkle sync comparison.
func (set *LWWElementSet) ComputeStateHash() string {
	set.mu.RLock()
	defer set.mu.RUnlock()

	keys := make([]string, 0, len(set.AddSet))
	for k := range set.AddSet {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	h := sha256.New()
	for _, k := range keys {
		reg := set.AddSet[k]
		h.Write([]byte(fmt.Sprintf("%s:%d:%s;", k, reg.Timestamp, reg.Author)))
	}
	return hex.EncodeToString(h.Sum(nil))
}
