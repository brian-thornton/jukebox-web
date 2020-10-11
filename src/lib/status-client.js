class StatusClient {
  static postProps = () => ({
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
  });

  static async getStatus() {
    const response = await fetch('/status/getStatus');
    const json = await response.json();
    return json;
  }
}

module.exports = StatusClient;
