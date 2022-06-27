package config

import (
	"fmt"
	"log"

	"github.com/ory/viper"
)

type AppConfig struct {
	NftPortKey       string `mapstructure:"NFT_PORT_KEY"`
	InfoLog         *log.Logger
}

func Setup(app *AppConfig) {
	viper.AddConfigPath(".")
	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Sprintf("Missing env file %v", err))
	}

	err = viper.Unmarshal(&app)
	if err != nil {
		panic(fmt.Sprintf("Missing env file %v", err))
	}
}
