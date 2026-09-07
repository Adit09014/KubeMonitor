package models

import (
	"encoding/json"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `gorm:"not null;size:255"`
	Username string `gorm:"uniqueIndex;not null;size:255"`
	Email    string `gorm:"uniqueIndex;not null;size:255"`
	Password string `gorm:"not null"` // Hashed password
	Role     string `gorm:"not null"` // E.g., "cluster-admin"
}

// Custom StringArray type to serialize/deserialize string slices into JSON
type StringArray []string

// Value implements the driver.Valuer interface for StringArray
func (a StringArray) Value() (interface{}, error) {
	if len(a) == 0 {
		return "[]", nil
	}
	return json.Marshal(a)
}

// Scan implements the sql.Scanner interface for StringArray
func (a *StringArray) Scan(value interface{}) error {
	if value == nil {
		*a = []string{}
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		*a = []string{}
		return nil
	}

	return json.Unmarshal(bytes, a)
}

type Role struct {
	gorm.Model
	Name      string      `json:"name" gorm:"uniqueIndex;not null;size:255"`
	Namespace string      `json:"namespace" gorm:"not null"`
	Rules     StringArray `json:"rules" gorm:"type:nvarchar(max)"`
}

type RoleBinding struct {
	gorm.Model
	Name      string      `json:"name" gorm:"uniqueIndex;not null;size:255"`
	Namespace string      `json:"namespace" gorm:"not null"`
	RoleRef   string      `json:"roleRef" gorm:"not null"`
	Subjects  StringArray `json:"subjects" gorm:"type:nvarchar(max)"`
}
