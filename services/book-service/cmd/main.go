package main

import (
	"bookstore/book-service/internal/config"
	"bookstore/book-service/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	r := gin.Default()

	r.POST("/books", handler.CreateBook)

	r.GET("/books", handler.GetBooks)

	r.GET("/books/:id", handler.GetBook)

	r.DELETE("/books/:id", handler.DeleteBook)

	r.Run(":8081")
}
