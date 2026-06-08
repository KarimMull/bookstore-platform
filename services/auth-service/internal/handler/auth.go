package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"bookstore/auth-service/internal/model"
	"bookstore/auth-service/internal/service"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB *gorm.DB
}

func (h *AuthHandler) Register(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	user.Password = string(hash)

	h.DB.Create(&user)
	c.JSON(200, gin.H{"message": "user created"})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input model.User
	var user model.User

	c.ShouldBindJSON(&input)

	h.DB.Where("email = ?", input.Email).First(&user)

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, _ := service.GenerateToken(user.Email)

	c.JSON(200, gin.H{"token": token})
}
