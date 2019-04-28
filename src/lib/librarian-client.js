class LibrarianClient {
  static async getAlbums() {
    const response = await fetch('/librarian/albums');
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
}

module.exports = LibrarianClient;
