package websocket

import (
    "fmt"
    "log"
    "encoding/json"

    "github.com/gorilla/websocket"
)

type Client struct {
    ID   string
    Conn *websocket.Conn
    Pool *Pool
    PublicKey string
    Alias string
    AliasSignature string
    WalletAddress string
}

type Message struct {
    Type string `json:"type"`
    Body string `json:"body"`
    Alias string `json:"alias"`
    SessionPublicKey string `json:"publicKey"`
    WalletAddress string `json:"walletAddr"`
    AliasSignature string `json:"sig"`
    To string `json:"to"`
    MemberList []Member `json:"members"`
}

type Member struct {
    Alias string `json:"alias"`
    WalletAddress string `json:"walletAddr"`
    AliasSignature string `json:"sig"`
    PublicKey string `json:"publicKey"`
}

func (c *Client) Read() {
    defer func() {
        c.Pool.Unregister <- c
        c.Conn.Close()
    }()

    for {
        _, p, err := c.Conn.ReadMessage()
        if err != nil {
            log.Println(err)
            return
        }

        var message Message
        err = json.Unmarshal(p, &message)
        if err != nil {
            fmt.Println("error:", err)
        }
        fmt.Printf("%+v", message)

        c.Pool.Broadcast <- message
        fmt.Printf("Message Received: %+v\n", message)
    
    }
}