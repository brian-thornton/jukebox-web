import { postParams } from './service-helper';

export default class QueueClient {
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
    let response;
    if (window.accessToken) {
      response = await fetch(`/queue/stop?token=${window.accessToken}`);
    } else {
      response = await fetch('/queue/stop');
    }
    return response;
  }

  static async next() {
    const response = await fetch('/queue/next');
    return response;
  }

  static async enqueue(track) {
    return QueueClient.enqueueTracks([track]);
  }

  static async enqueueTracks(tracks) {
    const response = await fetch('/queue/enqueueTracks', postParams(tracks));
    return response;
  }

  static async enqueueTracksTop(tracks) {
    const response = await fetch('/queue/enqueueTracksTop', postParams(tracks));
    return response;
  }

  static async removeTracksFromQueue(tracks) {
    const response = await fetch('/queue/removeFromQueue', postParams(tracks));
    return response;
  }

  static async clearQueue() {
    const response = await fetch('/queue/clearQueue', postParams({}));
    return response;
  }

  static async enqueueTop(track) {
    return this.enqueueTracksTop([track]);
  }
}