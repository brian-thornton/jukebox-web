const rp = require('request-promise');

class SpotifyClient {
  static getAccessToken() {
    let urlParams = new URLSearchParams(window.location.search);
    window.authorizationToken = urlParams.get('code');

    if (window.accessToken) {
      return Promise.resolve(window.accessToken);
    }

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: window.authorizationToken,
        redirect_uri: "http://localhost:3000",
        grant_type: 'authorization_code',
        client_id: "<some_id>",
        client_secret: "<some_secret>",
      },
      json: true
    };
    return rp.post(authOptions);
  }

  static getAuthorizationToken = (redirectUri) => {
    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('code')) {
      window.authorizationToken = urlParams.get('code');
      return;
    }

    let scopes = 'user-read-private user-read-email playlist-read-private playlist-modify-public ' +
      'playlist-read-collaborative playlist-modify-private user-read-currently-playing user-modify-playback-state ' +
      'user-read-playback-state user-read-recently-played user-top-read user-follow-read user-follow-modify ' +
      'app-remote-control streaming user-read-private user-read-email user-library-modify user-library-read';

    window.location.replace('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=a842760e748245a6b0572b3bd8e1a953' +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + redirectUri);
  }

  static async findAlbums(search, limit, offset) {
    let response;
    if (offset) {
      response = await fetch(`/spotify/findAlbums?token=${window.accessToken}&search=${search}&limit=${limit}&offset=${offset}`);
    } else {
      response = await fetch(`/spotify/findAlbums?token=${window.accessToken}&search=${search}`);
    }
    const json = await response.json();
    return json;
  }

  static async newReleases(limit, offset) {
    let response;
    if (limit && offset) {
      response = await fetch(`/spotify/newReleases?token=${window.accessToken}&limit=${limit}&offset=${offset}`);
    } else {
      response = await fetch(`/spotify/newReleases?token=${window.accessToken}`);
    }
    const json = await response.json();
    return json;
  }

  static async categories() {
    const response = await fetch(`/spotify/getCategories?token=${window.accessToken}`);
    const json = await response.json();
    return json;
  }

  static async getTracks(albumId) {
    const response = await fetch(`/spotify/getTracks?token=${window.accessToken}&albumId=${albumId}`);
    const json = await response.json();
    return json;
  }
}

module.exports = SpotifyClient;
