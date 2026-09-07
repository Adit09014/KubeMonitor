package database

import (
	"log"
	"os"

	"kubepulse-go/models"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	server := os.Getenv("MSSQL_SERVER")
	databaseName := os.Getenv("MSSQL_DATABASE")
	trustedConn := os.Getenv("MSSQL_TRUSTED_CONNECTION")
	encrypt := os.Getenv("MSSQL_ENCRYPT")
	trustCert := os.Getenv("MSSQL_TRUST_SERVER_CERTIFICATE")

	if server == "" || databaseName == "" {
		log.Fatal("MSSQL_SERVER or MSSQL_DATABASE environment variable not set")
	}

	dsn := "server=" + server + ";database=" + databaseName + ";"
	if trustedConn != "" {
		dsn += "trusted_connection=" + trustedConn + ";"
	}
	if encrypt != "" {
		dsn += "encrypt=" + encrypt + ";"
	}
	if trustCert != "" {
		dsn += "TrustServerCertificate=" + trustCert + ";"
	}

	var err error
	DB, err = gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Successfully connected to SQL Server!")

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
