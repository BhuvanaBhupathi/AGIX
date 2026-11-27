// Package presence manages multi-user cursor streams, spatial partitioning, and viewport culling.
package presence

import (
	"math"
	"sync"
	"time"
)

// Point2D represents Cartesian coordinates on the collaborative zoomable canvas.
type Point2D struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// UserCursor tracks an active collaborator's pointer state and viewport bounds.
type UserCursor struct {
	ClientID   string    `json:"client_id"`
	UserName   string    `json:"user_name"`
	Color      string    `json:"color"`
	Position   Point2D   `json:"position"`
	Velocity   Point2D   `json:"velocity"`
	Viewport   [4]float64 `json:"viewport"` // [minX, minY, maxX, maxY]
	LastActive time.Time `json:"last_active"`
}

// SpatialHashGrid partitions continuous 2D space into discrete grid buckets
// to enable O(1) viewport neighbor queries during high-concurrency editing.
type SpatialHashGrid struct {
	mu       sync.RWMutex
	cellSize float64
	buckets  map[int64]map[string]*UserCursor
}

// NewSpatialHashGrid initializes a grid with specified spatial cell dimensions.
func NewSpatialHashGrid(cellSize float64) *SpatialHashGrid {
	if cellSize <= 0 {
		cellSize = 250.0 // Default 250px grid partition
	}
	return &SpatialHashGrid{
		cellSize: cellSize,
		buckets:  make(map[int64]map[string]*UserCursor),
	}
}

func (grid *SpatialHashGrid) hash(x, y float64) int64 {
	cx := int64(math.Floor(x / grid.cellSize))
	cy := int64(math.Floor(y / grid.cellSize))
	// Cantor pairing function on signed 32-bit integers
	return (cx * 73856093) ^ (cy * 19349663)
}

// UpdateCursor inserts or moves a client's cursor in the spatial hash.
func (grid *SpatialHashGrid) UpdateCursor(cursor *UserCursor) {
	grid.mu.Lock()
	defer grid.mu.Unlock()

	h := grid.hash(cursor.Position.X, cursor.Position.Y)
	bucket, ok := grid.buckets[h]
	if !ok {
		bucket = make(map[string]*UserCursor)
		grid.buckets[h] = bucket
	}
	cursor.LastActive = time.Now()
	bucket[cursor.ClientID] = cursor
}

// GetVisiblePeers retrieves all cursors intersecting a given viewport frustum.
func (grid *SpatialHashGrid) GetVisiblePeers(vp [4]float64, excludeClientID string) []*UserCursor {
	grid.mu.RLock()
	defer grid.mu.RUnlock()

	minX, minY, maxX, maxY := vp[0], vp[1], vp[2], vp[3]
	visited := make(map[string]bool)
	var visible []*UserCursor

	minCX := int64(math.Floor(minX / grid.cellSize))
	maxCX := int64(math.Floor(maxX / grid.cellSize))
	minCY := int64(math.Floor(minY / grid.cellSize))
	maxCY := int64(math.Floor(maxY / grid.cellSize))

	for cx := minCX; cx <= maxCX; cx++ {
		for cy := minCY; cy <= maxCY; cy++ {
			h := (cx * 73856093) ^ (cy * 19349663)
			if bucket, exists := grid.buckets[h]; exists {
				for cid, c := range bucket {
					if cid == excludeClientID || visited[cid] {
						continue
					}
					// Verify inside bounding box
					if c.Position.X >= minX && c.Position.X <= maxX &&
						c.Position.Y >= minY && c.Position.Y <= maxY {
						visited[cid] = true
						visible = append(visible, c)
					}
				}
			}
		}
	}
	return visible
}

// PruneStale removes cursors that haven't dispatched telemetry within timeout window.
func (grid *SpatialHashGrid) PruneStale(timeout time.Duration) int {
	grid.mu.Lock()
	defer grid.mu.Unlock()

	now := time.Now()
	pruned := 0

	for h, bucket := range grid.buckets {
		for cid, c := range bucket {
			if now.Sub(c.LastActive) > timeout {
				delete(bucket, cid)
				pruned++
			}
		}
		if len(bucket) == 0 {
			delete(grid.buckets, h)
		}
	}
	return pruned
}
