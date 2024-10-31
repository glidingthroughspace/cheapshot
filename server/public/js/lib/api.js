export function createApiClient(log) {
  return function api(endpoint, method = "GET", body = undefined) {
    log({
      level: "debug",
      timestamp: Date.now(),
      source: "API",
      message: `Calling ${method} ${endpoint}`,
    });
    return fetch(`/api/v1${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          log({
            level: "error",
            timestamp: Date.now(),
            source: "SERVR",
            message: response.error,
          });
        }
        return response;
      })
      .catch((error) => {
        log({
          level: "error",
          timestamp: Date.now(),
          source: "MGMNT",
          message: error.toString(),
        });
      });
  };
}
