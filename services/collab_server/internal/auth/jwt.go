// Package auth provides secure token signing, role verification, and client link expiration.
package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

type UserRole string

const (
	RoleLeadDesigner UserRole = "lead_designer"
	RoleCollaborator UserRole = "collaborator"
	RoleClientViewer UserRole = "client_viewer"
)

type TokenClaims struct {
	ProjectID string   `json:"prj"`
	Role      UserRole `json:"rol"`
	ClientEmail string `json:"eml,omitempty"`
	ExpiresAt int64    `json:"exp"`
}

type TokenService struct {
	secret []byte
}

func NewTokenService(secret string) *TokenService {
	return &TokenService{secret: []byte(secret)}
}

func (s *TokenService) GenerateClientReviewLink(projectID string, clientEmail string, duration time.Duration) (string, error) {
	claims := TokenClaims{
		ProjectID:   projectID,
		Role:        RoleClientViewer,
		ClientEmail: clientEmail,
		ExpiresAt:   time.Now().Add(duration).Unix(),
	}

	headerJSON := `{"alg":"HS256","typ":"JWT"}`
	payloadJSON, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}

	hB64 := base64.RawURLEncoding.EncodeToString([]byte(headerJSON))
	pB64 := base64.RawURLEncoding.EncodeToString(payloadJSON)
	unsigned := fmt.Sprintf("%s.%s", hB64, pB64)

	mac := hmac.New(sha256.New, s.secret)
	mac.Write([]byte(unsigned))
	signature := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))

	return fmt.Sprintf("%s.%s", unsigned, signature), nil
}

func (s *TokenService) ValidateToken(token string) (*TokenClaims, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("malformed token structure")
	}

	unsigned := fmt.Sprintf("%s.%s", parts[0], parts[1])
	mac := hmac.New(sha256.New, s.secret)
	mac.Write([]byte(unsigned))
	expectedSig := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(parts[2]), []byte(expectedSig)) {
		return nil, fmt.Errorf("invalid token signature")
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, err
	}

	var claims TokenClaims
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return nil, err
	}

	if time.Now().Unix() > claims.ExpiresAt {
		return nil, fmt.Errorf("token has expired")
	}

	return &claims, nil
}
