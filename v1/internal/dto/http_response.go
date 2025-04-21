package dto

import "encoding/json"

type apiError struct {
	Message string `json:"message"`
}
type HttpResponse struct {
	Data  any       `json:"data,omitempty"`
	Error *apiError `json:"error,omitempty"`
}

func NewHttpResponse() *HttpResponse {
	return &HttpResponse{}
}

func (r *HttpResponse) Success(data any) *HttpResponse {
	r.Data = data
	r.Error = nil
	return r
}

func (r *HttpResponse) Fail(err error) *HttpResponse {
	r.Data = nil
	r.Error = &apiError{Message: err.Error()}
	return r
}

func (r *HttpResponse) String() string {
	if r.Data != nil {
		b, err := json.Marshal(r.Data)
		if err != nil {
			return "Marshal error"
		}
		return string(b)
	}
	return "Response data is empty"
}
