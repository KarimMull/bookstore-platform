package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Notification service started")

	for {
		fmt.Println("Listening Kafka events...")
		time.Sleep(5 * time.Second)
	}
}
