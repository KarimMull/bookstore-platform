package main

import (
	"log"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CartItem struct {
	ID       int     `json:"id"`
	BookID   int     `json:"book_id"`
	Book     Book    `json:"book"`
	Quantity int     `json:"quantity"`
}

type Book struct {
	ID     int     `json:"id"`
	Title  string  `json:"title"`
	Author string  `json:"author"`
	Price  float64 `json:"price"`
}

type Cart struct {
	Items []CartItem `json:"items"`
	Total float64    `json:"total"`
}

// Хранилище в памяти (для демо)
var cartStore = map[string]Cart{
	"1": {
		Items: []CartItem{
			{
				ID:       1,
				BookID:   1,
				Quantity: 2,
				Book: Book{
					ID:     1,
					Title:  "The Go Programming Language",
					Author: "Alan Donovan",
					Price:  49.99,
				},
			},
			{
				ID:       2,
				BookID:   3,
				Quantity: 1,
				Book: Book{
					ID:     3,
					Title:  "Clean Code",
					Author: "Robert C. Martin",
					Price:  45.99,
				},
			},
		},
		Total: 145.97,
	},
}

func main() {
	r := gin.Default()

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Get cart
	r.GET("/cart", func(c *gin.Context) {
		userID := c.GetHeader("X-User-ID")
		if userID == "" {
			userID = "1"
		}
		
		cart, exists := cartStore[userID]
		if !exists {
			c.JSON(200, gin.H{"items": []interface{}{}, "total": 0})
			return
		}
		c.JSON(200, cart)
	})

	// Add to cart
	r.POST("/cart/items", func(c *gin.Context) {
		var req struct {
			BookID   int `json:"book_id"`
			Quantity int `json:"quantity"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		userID := c.GetHeader("X-User-ID")
		if userID == "" {
			userID = "1"
		}

		cart := cartStore[userID]
		// Находим книгу
		book := Book{
			ID:    req.BookID,
			Title: "Book " + strconv.Itoa(req.BookID),
			Author: "Author",
			Price: 29.99,
		}

		// Проверяем есть ли уже
		for i, item := range cart.Items {
			if item.BookID == req.BookID {
				cart.Items[i].Quantity += req.Quantity
				cart.Total += book.Price * float64(req.Quantity)
				cartStore[userID] = cart
				c.JSON(200, gin.H{"message": "updated", "cart": cart})
				return
			}
		}

		newItem := CartItem{
			ID:       len(cart.Items) + 1,
			BookID:   req.BookID,
			Book:     book,
			Quantity: req.Quantity,
		}
		cart.Items = append(cart.Items, newItem)
		cart.Total += book.Price * float64(req.Quantity)
		cartStore[userID] = cart

		c.JSON(201, gin.H{"message": "added", "cart": cart})
	})

	// Update cart item
	r.PUT("/cart/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		var req struct {
			Quantity int `json:"quantity"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		userID := c.GetHeader("X-User-ID")
		if userID == "" {
			userID = "1"
		}

		cart := cartStore[userID]
		itemID, _ := strconv.Atoi(id)
		for i, item := range cart.Items {
			if item.ID == itemID {
				oldTotal := item.Book.Price * float64(item.Quantity)
				newTotal := item.Book.Price * float64(req.Quantity)
				cart.Total = cart.Total - oldTotal + newTotal
				cart.Items[i].Quantity = req.Quantity
				cartStore[userID] = cart
				c.JSON(200, gin.H{"message": "updated", "cart": cart})
				return
			}
		}
		c.JSON(404, gin.H{"error": "item not found"})
	})

	// Remove from cart
	r.DELETE("/cart/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		userID := c.GetHeader("X-User-ID")
		if userID == "" {
			userID = "1"
		}

		cart := cartStore[userID]
		itemID, _ := strconv.Atoi(id)
		for i, item := range cart.Items {
			if item.ID == itemID {
				cart.Total -= item.Book.Price * float64(item.Quantity)
				cart.Items = append(cart.Items[:i], cart.Items[i+1:]...)
				cartStore[userID] = cart
				c.JSON(200, gin.H{"message": "removed", "cart": cart})
				return
			}
		}
		c.JSON(404, gin.H{"error": "item not found"})
	})

	// Clear cart
	r.DELETE("/cart", func(c *gin.Context) {
		userID := c.GetHeader("X-User-ID")
		if userID == "" {
			userID = "1"
		}
		cartStore[userID] = Cart{Items: []CartItem{}, Total: 0}
		c.JSON(200, gin.H{"message": "cleared"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	log.Printf("🚀 Cart Service running on port %s", port)
	r.Run(":" + port)
}
