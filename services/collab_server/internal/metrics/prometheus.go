// Package metrics provides production monitoring counters and latency histograms for AGIX real-time infrastructure.
package metrics

import (
	"fmt"
	"net/http"
	"sync"
	"sync/atomic"
	"time"
)

// ServerMetrics tracks real-time collaboration server telemetry.
type ServerMetrics struct {
	ActiveWebSockets   int64
	TotalRooms         int64
	MessagesReceived   uint64
	MessagesBroadcast  uint64
	BytesTransferred   uint64
	SyncConflictsResolved uint64

	mu            sync.RWMutex
	latencyBuckets [8]uint64
}

var DefaultMetrics = &ServerMetrics{}

// IncActiveConnections tracks connected browser client.
func (m *ServerMetrics) IncActiveConnections() {
	atomic.AddInt64(&m.ActiveWebSockets, 1)
}

// DecActiveConnections tracks disconnected browser client.
func (m *ServerMetrics) DecActiveConnections() {
	atomic.AddInt64(&m.ActiveWebSockets, -1)
}

// RecordMessageIn increments ingress counter and byte tally.
func (m *ServerMetrics) RecordMessageIn(byteLen int) {
	atomic.AddUint64(&m.MessagesReceived, 1)
	atomic.AddUint64(&m.BytesTransferred, uint64(byteLen))
}

// RecordMessageOut increments egress dispatch counter.
func (m *ServerMetrics) RecordMessageOut(receivers int, byteLen int) {
	atomic.AddUint64(&m.MessagesBroadcast, uint64(receivers))
	atomic.AddUint64(&m.BytesTransferred, uint64(byteLen*receivers))
}

// RecordDispatchLatency records internal queue transit latency.
func (m *ServerMetrics) RecordDispatchLatency(d time.Duration) {
	ms := d.Milliseconds()
	m.mu.Lock()
	defer m.mu.Unlock()

	switch {
	case ms < 1:
		m.latencyBuckets[0]++
	case ms < 5:
		m.latencyBuckets[1]++
	case ms < 15:
		m.latencyBuckets[2]++
	case ms < 30:
		m.latencyBuckets[3]++
	case ms < 60:
		m.latencyBuckets[4]++
	case ms < 120:
		m.latencyBuckets[5]++
	case ms < 250:
		m.latencyBuckets[6]++
	default:
		m.latencyBuckets[7]++
	}
}

// Handler returns a standard Prometheus-formatted text exposition endpoint.
func (m *ServerMetrics) Handler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; version=0.0.4; charset=utf-8")

		fmt.Fprintf(w, "# HELP agix_collab_active_websockets Number of currently connected client WebSockets\n")
		fmt.Fprintf(w, "# TYPE agix_collab_active_websockets gauge\n")
		fmt.Fprintf(w, "agix_collab_active_websockets %d\n\n", atomic.LoadInt64(&m.ActiveWebSockets))

		fmt.Fprintf(w, "# HELP agix_collab_messages_received_total Total incoming WebSocket frames received\n")
		fmt.Fprintf(w, "# TYPE agix_collab_messages_received_total counter\n")
		fmt.Fprintf(w, "agix_collab_messages_received_total %d\n\n", atomic.LoadUint64(&m.MessagesReceived))

		fmt.Fprintf(w, "# HELP agix_collab_messages_broadcast_total Total outgoing WebSocket frames dispatched\n")
		fmt.Fprintf(w, "# TYPE agix_collab_messages_broadcast_total counter\n")
		fmt.Fprintf(w, "agix_collab_messages_broadcast_total %d\n\n", atomic.LoadUint64(&m.MessagesBroadcast))

		fmt.Fprintf(w, "# HELP agix_collab_bytes_transferred_total Total network bandwidth volume in bytes\n")
		fmt.Fprintf(w, "# TYPE agix_collab_bytes_transferred_total counter\n")
		fmt.Fprintf(w, "agix_collab_bytes_transferred_total %d\n\n", atomic.LoadUint64(&m.BytesTransferred))

		fmt.Fprintf(w, "# HELP agix_collab_sync_conflicts_resolved_total Total CRDT LWW register conflicts deterministically resolved\n")
		fmt.Fprintf(w, "# TYPE agix_collab_sync_conflicts_resolved_total counter\n")
		fmt.Fprintf(w, "agix_collab_sync_conflicts_resolved_total %d\n", atomic.LoadUint64(&m.SyncConflictsResolved))
	}
}
