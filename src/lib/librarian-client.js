import { postParams } from './service-helper';

export default class LibrarianClient {
  static async getLibraries() {
    const response = await fetch('/librarian/libraries');
    const json = await response.json();
    return json;
  }

  static async getAlbums(start, limit) {
    const response = await fetch(`/librarian/albums?start=${start}&limit=${limit}`);
    const json = await response.json();
    return json;
  }

  static async searchAlbums(search) {
    const response = await fetch(`/librarian/albums/search?search=${search}`);
    const json = await response.json();
    return json;
  }

  static async searchTracks(search) {
    const response = await fetch(`/librarian/tracks/search?search=${search}`);
    const json = await response.json();
    return json;
  }

  static async getTracks(start, limit) {
    const response = await fetch(`/librarian/tracks?start=${start}&limit=${limit}`);
    const json = await response.json();
    return json;
  }

  static async getCoverArt(path) {
    const response = await fetch(`/librarian/coverArt?path=${path}`);
    const blob = await response.blob();
    return blob;
  }

  static async getAlbumTracks(path) {
    const response = await fetch(`/librarian/albumTracks?path=${path}`);
    const json = await response.json();
    return json;
  }

  static async delete(name) {
    const response = await fetch(`/librarian/?name=${name}`, {
      method: 'delete',
    });
    return response;
  }

  static async add(library) {
    const response = await fetch('/librarian/add', postParams(library));
    return response;
  }

  static async scan(library) {
    // Clear tracks from previous scans so we are not sending a large
    // volume of data over the wire that will be overwritten.
    delete library.tracks;
    const response = await fetch('/librarian/scan', postParams(library));
    return response;
  }

  static async saveCoverArt(cover) {
    const response = await fetch('/librarian/saveCoverArt', postParams(cover));
    return response;
  }

  static async removeCoverArt(album) {
    const response = await fetch('/librarian/removeCoverArt', postParams(album));
    return response;
  }

  static async downloadTrack(track) {
    const response = await fetch(`/librarian/downloadTrack?file=${track.path}`);
    return response;
  }
}
