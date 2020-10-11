import PropTypes from 'prop-types';

export const Album = PropTypes.shape({
  name: PropTypes.string,
  path: PropTypes.string,
  coverArtExists: PropTypes.bool,
  trackCount: PropTypes.number,
});

export const Settings = PropTypes.shape({
  spotify: {
    useSpotify: PropTypes.bool,
    clientId: PropTypes.string,
    clientSecret: PropTypes.string,
    spotifyFeatures: {
      albums: PropTypes.bool,
      newReleases: PropTypes.bool,
      categories: PropTypes.bool
    }
  },
  features: {
    albums: PropTypes.bool,
    tracks: PropTypes.bool,
    playlists: PropTypes.bool,
    queue: PropTypes.bool,
    settings: PropTypes.bool,
    volume: PropTypes.bool,
    next: PropTypes.bool,
    stop: PropTypes.bool,
    play: PropTypes.bool,
    playNow: PropTypes.bool,
    enqueue: PropTypes.bool,
    playAlbum: PropTypes.bool,
    addToPlaylist: PropTypes.bool,
    deletePlaylist: PropTypes.bool,
    admin: PropTypes.bool
  },
  preferences: {
    name: PropTypes.string
  }
});