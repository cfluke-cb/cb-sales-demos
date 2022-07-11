package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/cfluke-cb/cb-sales-demos/chat-backend/pkg/config"
	"github.com/cfluke-cb/cb-sales-demos/chat-backend/pkg/nft"
	"github.com/cfluke-cb/cb-sales-demos/chat-backend/pkg/websocket"
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
	//check if they have an NFT in wallet
	body, err := nft.Repo.Fetch("solana", query.Get("walletAddr"))
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	} else {
		fmt.Printf("%+v\n", body)
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
		NftCollection:  body,
	}

	pool.Register <- client
	client.Read()
}

func setupRoutes(router *mux.Router, app config.AppConfig) {
	pool := websocket.NewPool()
	go pool.Start()

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "ok\n")
	})

	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})

	repo := nft.NewRepo(&app)
	nft.NewHandlers(repo)

	router.HandleFunc("/nftgate", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("NFT Gate Endpoint Hit", r.URL.Query())
		query := r.URL.Query()
		addr := query.Get("address")
		net := query.Get("network")
		body, err := nft.Repo.Fetch(net, addr)
		if err != nil {
			fmt.Fprintf(w, "%+v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			io.WriteString(w, "")
			return
		}
		w.WriteHeader(http.StatusOK)
		response, _ := json.Marshal(body)
		io.WriteString(w, string(response))
	})
}

func main() {
	var wait time.Duration
	var app config.AppConfig

	config.Setup(&app)

	router := mux.NewRouter()
	setupRoutes(router, app)

	port := "8443"

	if len(os.Getenv("PORT")) > 0 {
		port = os.Getenv("PORT")
	}

	fmt.Printf("starting listener on: %s\n", port)

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"https://app.friendofours.xyz", "https://localhost:8443", "http://localhost:8443"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	srv := &http.Server{
		Handler:      handlers.CORS(originsOk, headersOk, methodsOk)(router),
		Addr:         fmt.Sprintf(":%s", port),
		WriteTimeout: 40 * time.Second,
		ReadTimeout:  40 * time.Second,
	}

	go func() {
		prod := flag.Bool("prod", false, "a bool")
		flag.Parse()

		if *prod {
			if err := srv.ListenAndServeTLS("server.crt", "server.key"); err != nil {
				//if err := srv.ListenAndServe(); err != nil {
				log.Fatal("ListenAndServe: ", err)
			}
		} else {
			if err := srv.ListenAndServe(); err != nil {
				//if err := srv.ListenAndServe(); err != nil {
				log.Fatal("ListenAndServe: ", err)
			}
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
