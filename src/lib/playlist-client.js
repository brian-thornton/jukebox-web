import { postParams } from './service-helper';

export default class PlaylistClient {
  static async getPlaylists() {
    const response = await fetch('/playlists/getAll');
    const json = await response.json();
    return json;
  }

  static async getPlaylist(name) {
    const response = await fetch(`/playlists/getPlaylist?name=${name}`);
    const json = await response.json();
    return json;
  }

  static async addTracksToPlaylist(name, tracks) {
    const response = await fetch('/playlists/addToPlaylist', postParams({ name, tracks }));
    return response;
  }

  static async removeTracksFromPlaylist(name, tracks) {
    const response = await fetch('/playlists/removeFromPlaylist', postParams({ name, tracks }));
    return response;
  }

  static async add(playlist) {
    const response = await fetch('/playlists/add', postParams(playlist));
    return response;
  }

  static async delete(name) {
    const response = await fetch('/playlists/delete', postParams({ name }));
    return response;
  }
}
