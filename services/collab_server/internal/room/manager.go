// Package room manages in-memory cached state for active creative projects.
package room

import (
	"sync"
	"time"

	"github.com/agix/collab-server/internal/protocol"
)

type ProjectState struct {
	ProjectID      string                            `json:"project_id"`
	LastModified   time.Time                         `json:"last_modified"`
	ActivePalette  []string                          `json:"active_palette"`
	CanvasObjects  map[string]protocol.CanvasMovePayload `json:"canvas_objects"`
	ApprovedStatus bool                              `json:"approved_status"`
	mutex          sync.RWMutex
}

type Manager struct {
	projects map[string]*ProjectState
	mutex    sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		projects: make(map[string]*ProjectState),
	}
}

func (m *Manager) GetOrCreate(projectID string) *ProjectState {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	if state, ok := m.projects[projectID]; ok {
		return state
	}

	state := &ProjectState{
		ProjectID:     projectID,
		LastModified:  time.Now(),
		ActivePalette: []string{"#191918", "#7C3AED", "#EC4899", "#38BDF8"},
		CanvasObjects: make(map[string]protocol.CanvasMovePayload),
	}
	m.projects[projectID] = state
	return state
}

func (s *ProjectState) UpdateObject(payload protocol.CanvasMovePayload) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.CanvasObjects[payload.ObjectID] = payload
	s.LastModified = time.Now()
}

func (s *ProjectState) SetPalette(colors []string) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.ActivePalette = colors
	s.LastModified = time.Now()
}
