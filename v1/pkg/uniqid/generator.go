package uniqid

import (
	"fmt"
	"net"

	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid/snowflake"
	"github.com/ravoni4devs/argonauth/v1/pkg/uniqid/uuid"
)

type UniqID interface {
	ID() uint64
	UuidV4() string
	UuidV7() string
}

type idGenerator struct{}

func New() UniqID {
	// snowflake.SetMachineID(snowflake.PrivateIPToMachineID())
	return &idGenerator{}
}

func (s *idGenerator) UuidV4() string {
	return uuid.NewV4()
}

func (s *idGenerator) UuidV7() string {
	return uuid.NewV7()
}

func (s *idGenerator) ID() uint64 {
	return snowflake.ID()
}

func MachineID() (uint16, error) {
	ip, err := getLocalIP()
	if ip == "" {
		return 0, fmt.Errorf("cannot get local IP address: %s", err)
	}
	id := uint16(ip[2])<<8 + uint16(ip[3])
	return id, nil
}

func getLocalIP() (string, error) {
	interfaces, err := net.Interfaces()
	if err != nil {
		return "", err
	}
	for _, iface := range interfaces {
		addrs, err := iface.Addrs()
		if err != nil {
			return "", err
		}
		for _, addr := range addrs {
			// Extract the IP address from the address
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}
			if ip == nil || ip.IsLoopback() {
				fmt.Println(">>> ip=", ip)
				continue
			}
			// Append the IP address to the list
			return ip.String(), nil
		}
	}
	return "", nil
}
