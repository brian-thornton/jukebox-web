class LibrarianClient {
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
}

module.exports = LibrarianClient;
