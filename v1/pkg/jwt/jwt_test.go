package jwt

import (
	"testing"
	"time"
)

const (
	USER_ID = "55157b04-e41d-414a-93d6-f55d43cb8f05"
)

func TestGenerateJwtExpiringInOneDay(t *testing.T) {
	expiration := time.Duration(time.Second * 86400)
	j := New(Config{
		Audience:   "web",
		Issuer:     "myapp",
		Expiration: expiration,
		Secret:     "mysecret",
	})
	token, err := j.GenerateToken(USER_ID)
	if err != nil {
		t.Fatalf("error generateToken: %s", err)
	}
	if len(token) == 0 {
		t.Fatalf("token length is zero")
	}

	id, err := j.ParseToken(token)
	if err != nil {
		t.Fatalf("error parseToken: %s", err)
	}
	if id != USER_ID {
		t.Fatalf("expected id=%s but got %s", USER_ID, id)
	}
}
