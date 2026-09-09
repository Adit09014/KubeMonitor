package models

import (
	"database/sql/driver"
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
func (a StringArray) Value() (driver.Value, error) {
	if len(a) == 0 {
		return "[]", nil
	}
	b, err := json.Marshal(a)
	return string(b), err
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

	if err := json.Unmarshal(bytes, a); err != nil {
		// If not JSON formatted, treat as single string element
		str := string(bytes)
		if str != "" && str != "[]" {
			*a = []string{str}
		} else {
			*a = []string{}
		}
		return nil
	}
	return nil
}

type Role struct {
	gorm.Model
	Name      string      `json:"name" gorm:"uniqueIndex;not null;size:255"`
	Namespace string      `json:"namespace" gorm:"not null"`
	Rules     StringArray `json:"rules" gorm:"type:text"`
}

type RoleBinding struct {
	gorm.Model
	Name      string      `json:"name" gorm:"uniqueIndex;not null;size:255"`
	Namespace string      `json:"namespace" gorm:"not null"`
	RoleRef   string      `json:"roleRef" gorm:"not null"`
	Subjects  StringArray `json:"subjects" gorm:"type:text"`
}
