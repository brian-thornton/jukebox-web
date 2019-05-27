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
    const response = await fetch(`/queue/enqueue?track=${track}`);
    const blob = await response.blob();
    return blob;
  }

  static async enqueueTracks(tracks) {
    const response = await fetch('/queue/enqueueTracks', {
      method: 'post',
      body: JSON.stringify(tracks),
    });
    const json = await response.json();
    return json;
  }

  static async enqueueTracksTop(tracks) {
    const response = await fetch('/queue/enqueueTracksTop', {
      method: 'post',
      body: JSON.stringify(tracks),
    });
    const json = await response.json();
    return json;
  }

  static async enqueueTop(track) {
    const response = await fetch(`/queue/enqueueTop?track=${track}`);
    const blob = await response.blob();
    return blob;
  }
}

module.exports = QueueClient;
