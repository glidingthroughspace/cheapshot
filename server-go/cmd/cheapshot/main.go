package main

import (
	"log/slog"

	"github.com/glidingthroughspace/cheapshot/server/web"
)

func main() {
	slog.Info("Starting server")
	slog.Info("Will listen on http://localhost:8080")
	web.StartServer()
}
