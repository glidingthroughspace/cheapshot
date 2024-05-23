package messaging

import (
	"context"
	"net"
	"testing"
)

func TestHubIPOfCenterPhone(t *testing.T) {
	type testcase struct {
		name       string
		input      []*Client
		expectedIP net.IP
	}
	tests := []testcase{
		{
			name:       "No client connected",
			input:      []*Client{},
			expectedIP: nil,
		},
		{
			name:       "One client",
			input:      []*Client{clientWithIP(1, "127.0.1.1")},
			expectedIP: net.ParseIP("127.0.1.1"),
		}, {
			name:       "Two clients",
			input:      []*Client{clientWithIP(1, "127.0.1.1"), clientWithIP(2, "127.0.1.2")},
			expectedIP: net.ParseIP("127.0.1.1"),
		}, {
			name:       "Three clients",
			input:      []*Client{clientWithIP(1, "127.0.1.1"), clientWithIP(2, "127.0.1.2"), clientWithIP(3, "127.0.1.3")},
			expectedIP: net.ParseIP("127.0.1.2"),
		},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			hub := NewHub()
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			go hub.Run(ctx)
			for _, c := range tc.input {
				hub.Register <- c
			}
			actualIP := hub.IPOfCenterPhone()
			if actualIP.String() != tc.expectedIP.String() {
				t.Errorf("Expected IP %v, got %v", tc.expectedIP, actualIP)
			}
		})
	}
}

func clientWithIP(idx int, ip string) *Client {
	return NewClient(nil, nil, idx, net.ParseIP(ip))
}
