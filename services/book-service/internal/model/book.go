package model

import "time"

type Book struct {
    ID          uint      `json:"id" gorm:"primaryKey"`
    Title       string    `json:"title" gorm:"not null"`
    Author      string    `json:"author" gorm:"not null"`
    Price       float64   `json:"price" gorm:"not null"`
    Stock       int       `json:"stock" gorm:"default:0"`
    Description string    `json:"description"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}
