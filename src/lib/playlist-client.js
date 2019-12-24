class PlaylistClient {
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
    const response = await fetch('/playlists/addToPlaylist', {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(
        {
          name,
          tracks,
        },
      ),
    });
    return response;
  }

  static async removeTracksFromPlaylist(name, tracks) {
    const response = await fetch('/playlists/removeFromPlaylist', {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(
        {
          name,
          tracks,
        },
      ),
    });
    return response;
  }

  static async add(playlist) {
    const response = await fetch('/playlists/add', {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(playlist),
    });
    return response;
  }
}

module.exports = PlaylistClient;
