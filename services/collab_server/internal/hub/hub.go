// Package hub manages connected WebSocket clients, broadcasting, and room subscriptions.
package hub

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/agix/collab-server/internal/protocol"
)

type Client struct {
	ID        string
	ProjectID string
	SendChan  chan []byte
}

type Hub struct {
	clients    map[*Client]bool
	rooms      map[string]map[*Client]bool
	broadcast  chan protocol.EventEnvelope
	register   chan *Client
	unregister chan *Client
	mutex      sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		rooms:      make(map[string]map[*Client]bool),
		broadcast:  make(chan protocol.EventEnvelope, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			if _, exists := h.rooms[client.ProjectID]; !exists {
				h.rooms[client.ProjectID] = make(map[*Client]bool)
			}
			h.rooms[client.ProjectID][client] = true
			h.mutex.Unlock()
			log.Printf("[Hub] Registered client %s in project %s", client.ID, client.ProjectID)

		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.SendChan)
				if room, ok := h.rooms[client.ProjectID]; ok {
					delete(room, client)
					if len(room) == 0 {
						delete(h.rooms, client.ProjectID)
					}
				}
			}
			h.mutex.Unlock()
			log.Printf("[Hub] Unregistered client %s", client.ID)

		case event := <-h.broadcast:
			h.mutex.RLock()
			roomClients, exists := h.rooms[event.ProjectID]
			if exists {
				data, err := json.Marshal(event)
				if err == nil {
					for client := range roomClients {
						select {
						case client.SendChan <- data:
						default:
							close(client.SendChan)
							delete(h.clients, client)
							delete(roomClients, client)
						}
					}
				}
			}
			h.mutex.RUnlock()
		}
	}
}

func (h *Hub) BroadcastEvent(event protocol.EventEnvelope) {
	event.Timestamp = time.Now().UnixMilli()
	h.broadcast <- event
}
