export default class StatusClient {
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
  
  static async getStatus() {
    const response = await fetch('/status/getStatus');
    const json = await response.json();
    return json;
  }

  static async updateStatus(status) {
    const response = await fetch('/status/updateStatus', {
      ...StatusClient.postProps,
      body: JSON.stringify(status),
    });
    return response;
  }
}

