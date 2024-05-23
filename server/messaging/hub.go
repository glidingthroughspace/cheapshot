package messaging

import (
	"context"
	"log/slog"
	"net"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	minimumNumberOfClients int
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
			slog.Info("Client registered", "index", client.phoneIndex, "ip", client.ip.String())
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
	return h.clientsByIndex()[numClients/2].ip
}

func (h *Hub) ClientCount() int {
	return len(h.clients)
}

func (h *Hub) SetMinimumClientCount(count int) {
	slog.Info("Setting minimum number of clients", "count", count)
	h.minimumNumberOfClients = count
}

func (h *Hub) HasRequiredNumberOfClients() bool {
	return h.ClientCount() >= h.minimumNumberOfClients
}

func (h *Hub) clientsByIndex() []*Client {
	clients := make([]*Client, len(h.clients))
	for client := range h.clients {
		slog.Debug("Client by index", "phoneIndex", client.phoneIndex)
		clients[client.phoneIndex-1] = client
	}
	return clients
}
