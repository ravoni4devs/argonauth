package httptest

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
)

type HttpClientTest struct {
	Cookie   *http.Cookie
	Token    string
	Username string
	Password string
	baseURL  string
}

func NewClient() HttpClientTest {
	return HttpClientTest{}
}

func DoGET(url string) *http.Request {
	req, _ := http.NewRequest("GET", url, nil)
	return req
}

func DoDELETE(url string) *http.Request {
	req, _ := http.NewRequest("DELETE", url, nil)
	return req
}

func DoPOST(url, jsonReq string) *http.Request {
	return makeRequest("POST", url, jsonReq)
}

func DoPUT(url, jsonReq string) *http.Request {
	return makeRequest("PUT", url, jsonReq)
}

func makeRequest(method, url, jsonReq string) *http.Request {
	req, _ := http.NewRequest(method, url, bytes.NewBuffer([]byte(jsonReq)))
	req.Header.Set("Content-Type", "application/json")
	return req
}

func WithCookie(name, value string) HttpClientTest {
	cookie := new(http.Cookie)
	cookie.Name = name
	cookie.Value = value
	return HttpClientTest{Cookie: cookie}
}

func WithTokenInHeader(token string) HttpClientTest {
	return HttpClientTest{
		Token: token,
	}
}

func WithBasicAuth(username, password string) HttpClientTest {
	return HttpClientTest{
		Username: username,
		Password: password,
	}
}

func (h HttpClientTest) WithBaseURL(url string) HttpClientTest {
	h.baseURL = url
	return h
}

func (h HttpClientTest) DoPOST(url, jsonReq string) *http.Request {
	uri := h.baseURL + url
	req := DoPOST(uri, jsonReq)
	return h.addTokenIn(req)
}

func (h HttpClientTest) DoGET(url string) *http.Request {
	uri := h.baseURL + url
	req, _ := http.NewRequest("GET", uri, nil)
	return h.addTokenIn(req)
}

func (h HttpClientTest) DoPUT(url, jsonReq string) *http.Request {
	uri := h.baseURL + url
	req := DoPUT(uri, jsonReq)
	return h.addTokenIn(req)
}

func (h HttpClientTest) addTokenIn(req *http.Request) *http.Request {
	if h.Cookie != nil {
		req.AddCookie(h.Cookie)
		return req
	}
	if h.Token != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", h.Token))
		return req
	}
	credentials := h.Username + ":" + h.Password
	auth := base64.StdEncoding.EncodeToString([]byte(credentials))
	req.Header.Set("Authorization", "basic "+auth)
	return req
}
