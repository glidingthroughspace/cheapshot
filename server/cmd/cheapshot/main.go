package main

import (
	"context"
	"log/slog"
	"os/signal"
	"syscall"
	"time"

	"github.com/glidingthroughspace/cheapshot/api"
	"github.com/glidingthroughspace/cheapshot/messaging"
)

func main() {
	slog.Info("Starting CheapShot server")
	ctx, _ := signal.NotifyContext(context.Background(), syscall.SIGINT)

	hubCtx, stopHub := context.WithCancel(context.Background())
	hub := messaging.NewHub()
	host := "0.0.0.0"
	port := 7070
	// Start all subsystems
	go api.Run(host, port, hub)
	go hub.Run(hubCtx)
	slog.Info("Server started")
	// Wait for a termination signal
	<-ctx.Done()
	slog.Info("Shutting down server due to signal")
	stopHub()
	shutdownContext, shutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdown()
	api.Shutdown(shutdownContext)
	slog.Info("Bye")
}
