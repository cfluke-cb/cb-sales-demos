package websocket

import "fmt"

type Pool struct {
    Register   chan *Client
    Unregister chan *Client
    Clients    map[*Client]bool
    Broadcast  chan Message
}

func NewPool() *Pool {
    return &Pool{
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
        Clients:    make(map[*Client]bool),
        Broadcast:  make(chan Message),
    }
}

func (pool *Pool) Start() {
    for {
        select {
        case client := <-pool.Register:
            pool.Clients[client] = true

            connMsg := Message{
                Type: "connect", 
                AliasSignature: client.AliasSignature, 
                SessionPublicKey: client.PublicKey, 
                Alias: client.Alias, 
                WalletAddress: client.WalletAddress, 
                NftCollection: client.NftCollection,
            }

            var members []Member
            fmt.Println("Size of Connection Pool: ", len(pool.Clients))
            for client, _ := range pool.Clients {
                fmt.Println(client)
                client.Conn.WriteJSON(connMsg)
                mem := Member{ 
                    Alias: client.Alias,
                    WalletAddress: client.WalletAddress,
                    AliasSignature: client.AliasSignature,
                    PublicKey: client.PublicKey,
                    NftCollection: client.NftCollection,
                }
                members = append(members, mem)
            }
            message := Message{Type: "memberList", MemberList: members}
            client.Conn.WriteJSON(message)

            break
        case client := <-pool.Unregister:
            alias := client.Alias
            delete(pool.Clients, client)
            fmt.Println("Size of Connection Pool: ", len(pool.Clients))
            for client, _ := range pool.Clients {
                message := Message{Type: "disconnect", Alias: alias, WalletAddress: client.WalletAddress}
                client.Conn.WriteJSON(message)
            }
            break
        case message := <-pool.Broadcast:
            
            for client, _ := range pool.Clients {
                fmt.Println("Should send to client?", client.Alias, message.To)
                if client.Alias == message.To {
                    if err := client.Conn.WriteJSON(message); err != nil {
                        fmt.Println(err)
                        return
                    } else {
                        fmt.Println("sent message to ", message, client.Alias)
                    }
                } 
            }
        }
    }
}