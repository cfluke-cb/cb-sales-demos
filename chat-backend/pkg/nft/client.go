package nft

import (
  "fmt"
  "net/http"
  "io/ioutil"
  "encoding/json"

  "github.com/cfluke-cb/cb-sales-demos/chat-backend/pkg/config"
)

// Repo the repository used by the handlers
var Repo *Repository

// Repository is the repository type
type Repository struct {
	App   *config.AppConfig
}

// NewRepo creates a new repository
func NewRepo(a *config.AppConfig) *Repository {
	return &Repository{
		App:   a,
	}
}

// NewHandlers sets the repository for the handlers
func NewHandlers(r *Repository) {
	Repo = r
}

type NftItem struct {
	ContractAddress string      `json:"contract_address"`
	TokenID         string      `json:"token_id"`
	Name            string      `json:"name"`
	Description     string      `json:"description"`
	Collection           string `json:"collection"`
	CollectionName       string `json:"collectionName"`
	FileURL         string      `json:"file_url"`
}

type NftPortItem struct {
	ContractAddress string      `json:"contract_address"`
	TokenID         string      `json:"token_id"`
	Name            string      `json:"name"`
	Description     string      `json:"description"`
	FileURL         string      `json:"file_url"`
	AnimationURL    interface{} `json:"animation_url"`
	CreatorAddress  interface{} `json:"creator_address"`
}

type NftPortApiResponse struct {
	Response string `json:"response"`
	Nfts     []NftItem `json:"nfts"`
	Total        int    `json:"total"`
	Continuation string `json:"continuation"`
}

type EdenNftResponse struct {
	MintAddress          string `json:"mintAddress"`
	Owner                string `json:"owner"`
	Supply               int    `json:"supply"`
	Collection           string `json:"collection"`
	CollectionName       string `json:"collectionName"`
	Name                 string `json:"name"`
	UpdateAuthority      string `json:"updateAuthority"`
	PrimarySaleHappened  bool   `json:"primarySaleHappened"`
	SellerFeeBasisPoints int    `json:"sellerFeeBasisPoints"`
	Image                string `json:"image"`
	ExternalURL          string `json:"externalUrl"`
	Attributes           []struct {
		TraitType string `json:"trait_type"`
		Value     string `json:"value"`
	} `json:"attributes"`
	Properties struct {
		Files []struct {
			URI  string `json:"uri"`
			Type string `json:"type"`
		} `json:"files"`
		Creators []struct {
			Share   int    `json:"share"`
			Address string `json:"address"`
		} `json:"creators"`
	} `json:"properties"`
	ListStatus string `json:"listStatus"`
}


func (m *Repository) Fetch(network string, addr string) ([]NftItem, error) {
	fmt.Println(fmt.Sprintf("checking %x network for %s", network, addr))
	if network == "solana" {
		url := fmt.Sprintf("https://api-mainnet.magiceden.dev/v2/wallets/%s/tokens?offset=0&limit=100", addr)
		method := "GET"

		client := &http.Client {
		}
		req, err := http.NewRequest(method, url, nil)

		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		res, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		defer res.Body.Close()

		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		fmt.Println(string(body))
		var response []EdenNftResponse
		json.Unmarshal(body, &response)

		var normalized []NftItem

		for _, nft := range response {
			var item = NftItem{
				ContractAddress: nft.Properties.Creators[0].Address,
				TokenID: nft.MintAddress,         
				Name   : nft.Name,         
				Description   : "",  
				Collection   : nft.Collection,   
				CollectionName  : nft.CollectionName,
				FileURL     : nft.Properties.Files[0].URI,    
			}
			normalized = append(normalized, item)
		}

		return normalized, nil
	} else {
		url := fmt.Sprintf("https://api.nftport.xyz/v0/accounts/%s?chain=%s", addr, network)
		method := "GET"

		client := &http.Client {
		}
		req, err := http.NewRequest(method, url, nil)

		req.Header.Add("Content-Type", "application/json")
		req.Header.Add("Authorization", m.App.NftPortKey)

		fmt.Println("Getting ", url)


		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		res, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		defer res.Body.Close()

		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		fmt.Println(string(body))
		var response NftPortApiResponse
		json.Unmarshal(body, &response)


		var normalized []NftItem

		for _, nft := range response.Nfts {
			var item = NftItem{
				ContractAddress: nft.ContractAddress,
				TokenID: nft.TokenID,         
				Name   : nft.Name,         
				Description   : nft.Description,  
				Collection   : "",   
				CollectionName  : "",
				FileURL     : nft.FileURL,    
			}
			normalized = append(normalized, item)
		}

		return normalized, nil
	}
}