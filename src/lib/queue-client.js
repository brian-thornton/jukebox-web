class QueueClient {
  static async getQueue() {
    const response = await fetch('/queue/getQueue');
    const json = await response.json();
    return json;
  }

  static async play() {
    const response = await fetch('/queue/play');
    return response;
  }

  static async stop() {
    const response = await fetch('/queue/stop');
    return response;
  }

  static async next() {
    const response = await fetch('/queue/next');
    return response;
  }

  static async enqueue(track) {
    return QueueClient.enqueueTracks([track])
  }

  static async enqueueTracks(tracks) {
    const response = await fetch('/queue/enqueueTracks', {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(tracks),
    });
    return response;
  }

  static async enqueueTracksTop(tracks) {
    const response = await fetch('/queue/enqueueTracksTop', {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(tracks),
    });
    return response;
  }

  static async enqueueTop(track) {
    const response = await fetch(`/queue/enqueueTop?track=${track}`);
    const blob = await response.blob();
    return blob;
  }
}

module.exports = QueueClient;
