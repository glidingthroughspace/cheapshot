package messaging

import (
	"net"
	"testing"
)

func TestHubIPOfCenterPhone(t *testing.T) {
	type testcase struct {
		name       string
		input      map[*Client]bool
		expectedIP net.IP
	}
	tests := []testcase{
		{
			name:       "No client connected",
			input:      make(map[*Client]bool),
			expectedIP: nil,
		},
		{
			name:       "One client connected",
			input:      makeClientMap([]*Client{NewClient(nil, nil, 1, net.IP{})}),
			expectedIP: nil,
		},
	}
	for _, tc := range tests {
		t.Run(t.Name(), func(t *testing.T) {
			hub := ewHub()
			hub.Register <- tc.input
		})
	}
}

func makeClientMap(cs []*Client) map[*Client]bool {
	m := make(map[*Client]bool)
	for _, c := range cs {
		m[c] = true
	}
	return m
}
