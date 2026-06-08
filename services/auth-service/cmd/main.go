package main

import (
	"bookstore/auth-service/internal/config"
	"bookstore/auth-service/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	db := config.ConnectDB()
	db.AutoMigrate(&handler.AuthHandler{})

	r := gin.Default()

	h := &handler.AuthHandler{DB: db}

	r.POST("/register", h.Register)
	r.POST("/login", h.Login)

	r.Run(":8080")
}
