package main

import (
	"log"

	"bookstore/book-service/internal/config"
	"bookstore/book-service/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	// DB: connect + retry + migrate (всё внутри config)
	config.ConnectDB()

	r := gin.Default()

	// HEALTH CHECK (для Kubernetes probes)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// CRUD endpoints
	r.GET("/books", handler.GetBooks)
	r.GET("/books/:id", handler.GetBook)
	r.POST("/books", handler.CreateBook)
	r.PUT("/books/:id", handler.UpdateBook)
	r.DELETE("/books/:id", handler.DeleteBook)

	// server run
	if err := r.Run(":8081"); err != nil {
		log.Fatal("Server failed:", err)
	}
}
