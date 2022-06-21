package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/cfluke-cb/cb-sales-demos/apps/api/pkg/websocket"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
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

func setupRoutes(router *mux.Router) {
	pool := websocket.NewPool()
	go pool.Start()

	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "ok\n")
	})
}

func main() {
	var wait time.Duration
	router := mux.NewRouter()
	setupRoutes(router)

	port := "8443"

	if len(os.Getenv("PORT")) > 0 {
		port = os.Getenv("PORT")
	}

	fmt.Println(fmt.Sprintf("starting listener on: %s", port))

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"https://app.friendofours.xyz", "https://localhost:8443"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	srv := &http.Server{
		Handler:      handlers.CORS(originsOk, headersOk, methodsOk)(router),
		Addr:         fmt.Sprintf(":%s", port),
		WriteTimeout: 40 * time.Second,
		ReadTimeout:  40 * time.Second,
	}

	go func() {
		if err := srv.ListenAndServeTLS("server.crt", "server.key"); err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c

	ctx, cancel := context.WithTimeout(context.Background(), wait)
	defer cancel()

	srv.Shutdown(ctx)

	// Optionally, you could run srv.Shutdown in a goroutine and block on
	// <-ctx.Done() if your application should wait for other services
	// to finalize based on context cancellation.
	log.Println("stopping")
	os.Exit(0)
}
