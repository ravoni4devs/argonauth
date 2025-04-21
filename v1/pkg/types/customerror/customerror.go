package customerror

import (
	"net/http"
	"strings"
)

type grpcCode uint32

type CustomError struct {
	code            grpcCode
	message         string
	originalMessage string
}

const (
	unknown            = 2  // codes.Unknown
	invalid            = 3  // codes.InvalidArgument
	notFound           = 5  // codes.NotFound
	alreadyExists      = 6  // codes.AlreadyExists
	permissionDenied   = 7  // codes.PermissionDenied
	resourceExhausted  = 8  // codes.ResourceExhausted
	failedPrecondition = 9  // codes.FailedPrecondition
	OutOfRange         = 11 // codes.OutOfRange
	internal           = 13 // codes.Internal
	unavailable        = 14 // codes.Unavailable
	unauthenticated    = 16 // codes.Unauthenticated
)

var httpCodes = map[grpcCode]int{
	unknown:            http.StatusConflict,
	internal:           http.StatusInternalServerError,
	invalid:            http.StatusBadRequest,
	notFound:           http.StatusNotFound,
	alreadyExists:      http.StatusConflict,
	unauthenticated:    http.StatusUnauthorized,
	unavailable:        http.StatusInternalServerError,
	permissionDenied:   http.StatusForbidden,
	failedPrecondition: http.StatusPreconditionFailed,
	resourceExhausted:  http.StatusTooManyRequests,
	OutOfRange:         http.StatusLocked,
}

var errorsMap = map[string]grpcCode{
	"violates":                    invalid,
	"valid":                       invalid,
	"empty":                       invalid,
	"invalid token":               invalid,
	"parse":                       invalid,
	"duplicate key":               alreadyExists,
	"no rows in result":           notFound,
	"no results found":            notFound,
	"permission denied":           permissionDenied,
	"no responders available":     unavailable,
	"connect: connection refused": unavailable,
	"connection":                  unavailable,
	"mismatch":                    failedPrecondition,
	"expired":                     permissionDenied,
}

func (e *CustomError) Error() string {
	if len(e.message) > 0 {
		return e.originalMessage + " " + e.message
	}
	return e.originalMessage
}

func Unavailable(err error, message ...string) error {
	return Wrap(getInstance(unavailable, err, message...))
}

func Denied(err error, message ...string) error {
	return Wrap(getInstance(permissionDenied, err, message...))
}

func Locked(err error, message ...string) error {
	return Wrap(getInstance(OutOfRange, err, message...))
}

func PreConditionFailed(err error, message ...string) error {
	return Wrap(getInstance(failedPrecondition, err, message...))
}

func InvalidInput(err error, message ...string) error {
	return Wrap(getInstance(invalid, err, message...))
}

func Unauthenticated(err error, message ...string) error {
	return Wrap(getInstance(unauthenticated, err, message...))
}

func NotFound(err error, message ...string) error {
	return getInstance(notFound, err, message...)
}

func Wrap(err error) error {
	if err == nil {
		return nil
	}
	code := getCodeFrom(err)
	return getInstance(code, err)
}

func StatusCodeFrom(err error) int {
	if err != nil {
		code := getCodeFrom(err)
		return httpCodes[code]
	}
	return http.StatusExpectationFailed
}

func getCodeFrom(err error) grpcCode {
	customError, isCustomError := err.(*CustomError)
	if !isCustomError {
		return detectCodeAccordingToMessage(err)
	}
	if customError.code > 0 {
		return customError.code
	}
	return detectCodeAccordingToMessage(err)
}

func detectCodeAccordingToMessage(err error) grpcCode {
	errorMessage := err.Error()
	for message, code := range errorsMap {
		if strings.Contains(strings.ToLower(errorMessage), strings.ToLower(message)) {
			return code
		}
	}
	return internal
}

func getInstance(code grpcCode, err error, message ...string) *CustomError {
	customError := &CustomError{}
	customError.code = code
	if err != nil {
		customError.originalMessage = err.Error()
	}
	if len(message) > 0 {
		customError.message = message[0]
	}
	return customError
}
