package main

import (
	"fmt"
	"net/http"

	"github.com/cfluke-cb/cb-sales-demos/apps/api/pkg/websocket"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit", r.URL.Query())

	query := r.URL.Query()
	alias := query.Get("alias")
	if alias == "" {
		fmt.Println("Missing required connection params", query, alias)
		return
	}
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn:           conn,
		Pool:           pool,
		Alias:          query.Get("alias"),
		AliasSignature: query.Get("sig"),
		WalletAddress:  query.Get("walletAddr"),
		PublicKey:      query.Get("publicKey"),
	}

	pool.Register <- client
	client.Read()
}

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func main() {
	fmt.Println("Distributed Chat App v0.01")
	setupRoutes()
	http.ListenAndServe(":8443", nil)
}
