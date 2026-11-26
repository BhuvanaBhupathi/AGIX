// Package events defines JSON WebSocket protocol event payloads for AGIX collaboration.
package protocol

type EventType string

const (
	EventCanvasObjectMove    EventType = "canvas:object_move"
	EventCanvasPaletteUpdate EventType = "canvas:palette_update"
	EventSelectionChange     EventType = "user:selection_change"
	EventClientApproval      EventType = "client:direction_approved"
	EventClientComment       EventType = "client:comment_added"
	EventHeartbeat           EventType = "system:heartbeat"
)

type EventEnvelope struct {
	Type      EventType   `json:"type"`
	ProjectID string      `json:"project_id"`
	UserID    string      `json:"user_id"`
	Timestamp int64       `json:"timestamp"`
	Payload   interface{} `json:"payload"`
}

type CanvasMovePayload struct {
	ObjectID string  `json:"object_id"`
	X        float64 `json:"x"`
	Y        float64 `json:"y"`
	ZIndex   int     `json:"z_index"`
}

type PaletteUpdatePayload struct {
	PaletteName string   `json:"palette_name"`
	Colors      []string `json:"colors"`
	Source      string   `json:"source"`
}

type ClientApprovalPayload struct {
	DirectionID   string `json:"direction_id"`
	DirectionName string `json:"direction_name"`
	ClientEmail   string `json:"client_email"`
	Notes         string `json:"notes"`
	Approved      bool   `json:"approved"`
}
