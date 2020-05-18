class SettingsClient {
  static async getSettings() {
    const response = await fetch('/settings/getSettings');
    const json = await response.json();
    return json;
  }
}

module.exports = SettingsClient;
