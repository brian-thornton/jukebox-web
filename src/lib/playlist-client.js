class PlaylistClient {
  static async getPlaylists(start, limit) {
    const response = await fetch(`/playlists/getAll`);
    const json = await response.json();
    return json;
  }
}

module.exports = PlaylistClient;
