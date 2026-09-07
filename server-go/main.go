package main

import (
	"log"
	"time"

	"kubepulse-go/api"
	"kubepulse-go/database"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found or error reading it")
	}

	// Connect to Database
	database.Connect()
	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"message": "Go backend running",
		})
	})

	// Auth Routes
	authGroup := r.Group("/api/auth")
	{
		authGroup.POST("/login", api.LoginHandler)
		authGroup.POST("/register", api.RegisterHandler)
	}

	// RBAC Routes
	rbacGroup := r.Group("/api/rbac")
	// TODO: Add Auth Middleware here for real protection
	{
		rbacGroup.GET("/roles", api.GetRolesHandler)
		rbacGroup.GET("/bindings", api.GetRoleBindingsHandler)
	}

	log.Println("Go Server listening on :5000")
	r.Run(":5000")
}
