package web

import (
	"html/template"
	"net/http"
)

func StartServer() {
	mux := http.NewServeMux()
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./web/static/"))))
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		template.Must(template.ParseFiles("./web/templates/index.html")).Execute(w, nil)
	})
	http.ListenAndServe(":8080", mux)
}
