package model

import "time"

type Book struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title"`
	Author      string    `json:"author"`
	Price       float64   `json:"price"`
	Description string    `json:"description"`
	Stock       int       `json:"stock"`
	CreatedAt   time.Time `json:"created_at"`
}
