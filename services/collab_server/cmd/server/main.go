// AGIX Real-Time Collaboration Daemon in Go.
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/agix/collab-server/internal/hub"
	"github.com/agix/collab-server/internal/protocol"
	"github.com/agix/collab-server/internal/room"
)

func main() {
	port := 8080
	collabHub := hub.NewHub()
	go collabHub.Run()

	roomManager := room.NewManager()

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":      "online",
			"engine":      "AGIX Real-Time Go Sync Daemon",
			"concurrency": "goroutines",
			"uptime":      time.Now().Format(time.RFC3339),
		})
	})

	http.HandleFunc("/api/project/state", func(w http.ResponseWriter, r *http.Request) {
		projectID := r.URL.Query().Get("projectId")
		if projectID == "" {
			projectID = "default"
		}
		state := roomManager.GetOrCreate(projectID)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(state)
	})

	http.HandleFunc("/api/approval/submit", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var payload protocol.ClientApprovalPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		collabHub.BroadcastEvent(protocol.EventEnvelope{
			Type:      protocol.EventClientApproval,
			ProjectID: "active",
			UserID:    payload.ClientEmail,
			Payload:   payload,
		})

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"status":  "approval_broadcasted",
		})
	})

	log.Printf("[AGIX] Real-Time Go Collab Server starting on port :%d\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}
