package handler

import (
	"net/http"
	"strconv"

	"bookstore/book-service/internal/model"
	"bookstore/book-service/internal/service"

	"github.com/gin-gonic/gin"
)

func GetBooks(c *gin.Context) {
	books, _ := service.GetBooks()
	c.JSON(http.StatusOK, books)
}

func GetBook(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	book, err := service.GetBook(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, book)
}

func CreateBook(c *gin.Context) {
	var book model.Book
	if err := c.BindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service.CreateBook(&book)
	c.JSON(http.StatusCreated, book)
}

func UpdateBook(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var book model.Book
	c.BindJSON(&book)
	book.ID = uint(id)

	service.UpdateBook(&book)
	c.JSON(http.StatusOK, book)
}

func DeleteBook(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	service.DeleteBook(uint(id))
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
