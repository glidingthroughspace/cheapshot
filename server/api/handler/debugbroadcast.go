package handler

import (
	"net/http"

	"github.com/glidingthroughspace/cheapshot/messaging"
)

func DebugBroadcast(hub *messaging.Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		message := r.FormValue("message")
		hub.BroadcastBytes([]byte(message))
	}
}
