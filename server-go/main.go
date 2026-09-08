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
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Go backend running",
		})
	})

	// Auth Routes
	authGroup := r.Group("/api/auth")
	{
		authGroup.POST("/login", api.LoginHandler)
		authGroup.POST("/register", api.RegisterHandler)
		authGroup.GET("/me", api.MeHandler)
		authGroup.POST("/logout", api.LogoutHandler)
	}

	// RBAC Routes
	rbacGroup := r.Group("/api/rbac")
	rbacGroup.Use(api.AuthMiddleware())
	{
		rbacGroup.GET("/roles", api.GetRolesHandler)
		rbacGroup.GET("/bindings", api.GetRoleBindingsHandler)
	}

	// Cluster Routes
	clusterGroup := r.Group("/api/cluster")
	{
		clusterGroup.GET("/info", api.ClusterInfoHandler)
		clusterGroup.GET("/metrics", api.ClusterMetricsHandler)
		clusterGroup.GET("/nodes", api.ClusterNodesHandler)
	}

	log.Println("Go Server listening on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}