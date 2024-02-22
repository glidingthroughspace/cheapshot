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
	mux.Handle("POST /phones/{index}/photos", LogRequest(handler.UploadPhoto))
	mux.Handle("POST /trigger", LogRequest(handler.TakePhoto(hub)))
	mux.Handle("POST /debug/broadcast", LogRequest(handler.DebugBroadcast(hub)))

	srv = &http.Server{
		Addr:    fmt.Sprintf("%s:%d", host, port),
		Handler: mux,
	}
	return srv.ListenAndServe()
}

func Shutdown(ctx context.Context) error {
	return srv.Shutdown(ctx)
}
