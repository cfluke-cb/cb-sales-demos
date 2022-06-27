package websocket

import (
    "fmt"
    "log"
    "encoding/json"

    "github.com/cfluke-cb/cb-sales-demos/chat-backend/pkg/nft"
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
    NftCollection []nft.NftItem
}

type Message struct {
    Type string `json:"type"`
    Body string `json:"body"`
    Alias string `json:"alias"`
    SessionPublicKey string `json:"publicKey"`
    WalletAddress string `json:"walletAddr"`
    NftCollection []nft.NftItem `json:"nftCollection"`
    AliasSignature string `json:"sig"`
    To string `json:"to"`
    MemberList []Member `json:"members"`
}

type Member struct {
    Alias string `json:"alias"`
    WalletAddress string `json:"walletAddr"`
    AliasSignature string `json:"sig"`
    PublicKey string `json:"publicKey"`
    NftCollection []nft.NftItem `json:"nftCollection"`
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