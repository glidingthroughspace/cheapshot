package handler

import "net/http"

func Health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("I'm just fine, how are you?"))
}
