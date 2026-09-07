package api

import (
	"net/http"

	"kubepulse-go/database"
	"kubepulse-go/models"

	"github.com/gin-gonic/gin"
)

func GetRolesHandler(c *gin.Context) {
	var roles []models.Role
	if err := database.DB.Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch roles"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": roles})
}

func GetRoleBindingsHandler(c *gin.Context) {
	var bindings []models.RoleBinding
	if err := database.DB.Find(&bindings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch role bindings"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": bindings})
}
