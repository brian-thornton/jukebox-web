class StatusClient {
  static async getStatus() {
    const response = await fetch('/status/getStatus');
    const json = await response.json();
    return json;
  }
}

module.exports = StatusClient;
