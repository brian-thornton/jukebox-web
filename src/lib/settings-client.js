export default class SettingsClient {
  static postProps = {
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
  };

  static async getSettings() {
    const response = await fetch('/settings/getSettings');
    const json = await response.json();
    return json;
  }

  static async updateSettings(settings) {
    const response = await fetch('/settings/updateSettings', {
      ...SettingsClient.postProps,
      body: JSON.stringify(settings),
    });
    return response;
  }
}
