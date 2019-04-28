class QueueClient {
  static async play() {
    const response = await fetch('/queue/play');
    return response;
  }

  static async enqueue(track) {
    const response = await fetch(`/queue/enqueue?track=${track}`);
    const blob = await response.blob();
    return blob;
  }

  static async enqueueTop(track) {
    const response = await fetch(`/queue/enqueueTop?track=${track}`);
    const blob = await response.blob();
    return blob;
  }
}

module.exports = QueueClient;
