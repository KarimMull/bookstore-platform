package config

import (
	"log"
	"os"
	"time"

	"bookstore/book-service/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" port=" + os.Getenv("DB_PORT") +
		" sslmode=disable"

	var db *gorm.DB
	var err error

	// retry для Kubernetes (Postgres может ещё не подняться)
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			DB = db

			// AUTO MIGRATION (КРИТИЧНО)
			if err := DB.AutoMigrate(&model.Book{}); err != nil {
				log.Fatal("AutoMigrate failed:", err)
			}

			return
		}

		log.Println("DB connection attempt failed, retrying...", i+1)
		time.Sleep(2 * time.Second)
	}

	log.Fatal("DB connection failed:", err)
}
