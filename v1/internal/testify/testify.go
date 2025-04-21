package testify

import (
	"encoding/json"
	"testing"
)

func It(ts *testing.T, name string, fn func(t *testing.T)) {
	ts.Run(name, fn)
}

func structToMap(obj interface{}) map[string]interface{} {
	var result map[string]interface{}
	jsonBytes, err := json.Marshal(obj)
	if err != nil {
		return nil
	}
	err = json.Unmarshal(jsonBytes, &result)
	if err != nil {
		return nil
	}
	return result
}
