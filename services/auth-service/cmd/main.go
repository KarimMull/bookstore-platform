package main

import (
    "log"
    "os"

    "github.com/gin-gonic/gin"
    "bookstore/auth-service/internal/config"
    "bookstore/auth-service/internal/handler"
    "bookstore/auth-service/internal/middleware"
    "bookstore/auth-service/internal/model"
    "bookstore/auth-service/internal/repository"
    "bookstore/auth-service/internal/service"
)

func main() {
    db, err := config.InitDB()
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }

    if err := db.AutoMigrate(&model.User{}, &model.Comment{}); err != nil {
        log.Printf("⚠️ AutoMigrate warning: %v", err)
    }

    userRepo := repository.NewUserRepository(db)
    commentRepo := repository.NewCommentRepository(db)

    jwtService := service.NewJWTService(os.Getenv("JWT_SECRET"))
    authService := service.NewAuthService(userRepo, jwtService)
    commentService := service.NewCommentService(commentRepo)

    authHandler := handler.NewAuthHandler(authService)
    commentHandler := handler.NewCommentHandler(commentService)

    r := gin.Default()

    // Public routes
    r.POST("/register", authHandler.Register)
    r.POST("/login", authHandler.Login)
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    // Protected routes
    auth := r.Group("/")
    auth.Use(middleware.AuthMiddleware(jwtService))
    {
        auth.GET("/profile", authHandler.Profile)
        auth.POST("/comments", commentHandler.Create)
        auth.GET("/comments/book/:book_id", commentHandler.GetByBookID)
        auth.DELETE("/comments/:id", commentHandler.Delete)
    }

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    log.Printf("🚀 Auth Service running on port %s", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
