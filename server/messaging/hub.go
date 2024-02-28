package messaging

import (
	"context"
	"log/slog"
	"net"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run(ctx context.Context) {
	slog.Info("Hub starting")
	for {
		select {
		case client := <-h.Register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		case <-ctx.Done():
			slog.Info("Hub shutting down due to context cancellation")
			for client := range h.clients {
				delete(h.clients, client)
				close(client.send)
			}
			return
		}
	}
}

func (h *Hub) BroadcastBytes(message []byte) {
	slog.Info("Broadcasting message", "message", string(message))
	h.broadcast <- message
}

// IPOfCenterPhone returns the IP address of the "centermost" phone.
// If no phone is connected, this returns nil.
// Phones are expected to start with index 1.
func (h *Hub) IPOfCenterPhone() net.IP {
	numClients := len(h.clients)
	if numClients == 0 {
		return nil
	}
	if numClients == 1 {
		for client := range h.clients {
			return client.ip
		}
	}
	for client := range h.clients {
		if client.phoneIndex == (numClients / 2) {
			return nil
		}
	}
	slog.Error("No phone with an expected index is connected", "clients", numClients)
	return nil
}
