package service

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"bookstore/auth-service/internal/model"
)

type JWTService struct {
	secret string
}

func NewJWTService(secret string) *JWTService {
	if secret == "" {
		secret = "default-secret-key-change-in-production"
	}
	return &JWTService{secret: secret}
}

func (s *JWTService) GenerateToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secret))
}

func (s *JWTService) ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.secret), nil
	})
}
