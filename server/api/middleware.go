package api

import (
	"log/slog"
	"net/http"
)

func LogRequest(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		slog.Info("Request", "method", r.Method, "path", r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
