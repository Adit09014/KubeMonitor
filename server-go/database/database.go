package database

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"kubepulse-go/models"
)

var DB *gorm.DB

func Connect() {
	var err error
	DB, err = gorm.Open(sqlite.Open("kubepulse.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Successfully connected to SQLite database!")

	// Run AutoMigrate
	log.Println("Running AutoMigrate...")
	err = DB.AutoMigrate(&models.User{}, &models.Role{}, &models.RoleBinding{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("AutoMigrate completed successfully!")

	seedData()
}

func seedData() {
	var count int64

	// Check if roles exist
	DB.Model(&models.Role{}).Count(&count)
	if count == 0 {
		roles := []models.Role{
			{Name: "admin-role", Namespace: "default", Rules: models.StringArray{"*.*.*"}},
			{Name: "view-only", Namespace: "kube-system", Rules: models.StringArray{"pods.get", "services.get"}},
			{Name: "deployer", Namespace: "production", Rules: models.StringArray{"deployments.*", "pods.*"}},
		}
		DB.Create(&roles)
		log.Println("Seeded roles")
	}

	// Check if role bindings exist
	DB.Model(&models.RoleBinding{}).Count(&count)
	if count == 0 {
		bindings := []models.RoleBinding{
			{Name: "admin-binding", Namespace: "default", RoleRef: "admin-role", Subjects: models.StringArray{"admin-user"}},
			{Name: "viewer-binding", Namespace: "kube-system", RoleRef: "view-only", Subjects: models.StringArray{"dev-team"}},
		}
		DB.Create(&bindings)
		log.Println("Seeded role bindings")
	}
}
