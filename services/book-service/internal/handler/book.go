package handler

import (
	"net/http"
	"strconv"

	"bookstore/book-service/internal/config"
	"bookstore/book-service/internal/model"

	"github.com/gin-gonic/gin"
)

func CreateBook(c *gin.Context) {
	var book model.Book

	if err := c.BindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	config.DB.Create(&book)

	c.JSON(http.StatusCreated, book)
}

func GetBooks(c *gin.Context) {
	var books []model.Book

	config.DB.Find(&books)

	c.JSON(http.StatusOK, books)
}

func GetBook(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var book model.Book

	config.DB.First(&book, id)

	c.JSON(http.StatusOK, book)
}

func DeleteBook(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	config.DB.Delete(&model.Book{}, id)

	c.JSON(http.StatusOK, gin.H{
		"message": "deleted",
	})
}
