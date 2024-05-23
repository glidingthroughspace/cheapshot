package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/glidingthroughspace/cheapshot/api/handler"
	"github.com/glidingthroughspace/cheapshot/messaging"
)

var srv *http.Server

func Run(host string, port int, hub *messaging.Hub) error {
	mux := http.NewServeMux()
	mux.Handle("/health", LogRequest(handler.Health))
	mux.Handle("/phones/{index}", LogRequest(handler.RegisterPhone(hub)))
	mux.Handle("HEAD /snapshots/{id}", LogRequest(handler.PollSnapshot(hub)))
	mux.Handle("GET /snapshots/{id}", LogRequest(handler.GetSnapshot(hub)))
	mux.Handle("GET /preview-ip", LogRequest(handler.PreviewIP(hub)))
	mux.Handle("POST /snapshots", LogRequest(handler.TakePhoto(hub)))
	mux.Handle("POST /phones/{index}/photos", LogRequest(handler.UploadPhoto))
	mux.Handle("PUT /phones/minimumCount", LogRequest(handler.SetMinimumCount(hub)))
	mux.Handle("POST /debug/broadcast", LogRequest(handler.DebugBroadcast(hub)))
	mux.Handle("/", http.FileServer(http.Dir("./pages")))

	srv = &http.Server{
		Addr:    fmt.Sprintf("%s:%d", host, port),
		Handler: mux,
	}
	return srv.ListenAndServe()
}

func Shutdown(ctx context.Context) error {
	return srv.Shutdown(ctx)
}
