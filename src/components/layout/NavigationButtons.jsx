import React from 'react';
import { Nav } from 'react-bootstrap';

function NavigationButtons({
  settings,
  isScreenSmall,
  setMode,
  setCurrentAlbum,
}) {
  const addNavLink = (navLinks, feature, navKey, navName) => {
    if (feature) {
      navLinks.push(
        <Nav.Link
          key={navName}
          onClick={() => {
            setMode(navKey);
            setCurrentAlbum('');
            window.scrollTo(0, 0);
          }}
        >
          {navName}
        </Nav.Link>,
      );
    }
    return navLinks;
  };

  let navLinks = [];

  if (settings && settings.features) {
    const { spotify, features } = settings;
    const { spotifyFeatures } = spotify;

    navLinks = addNavLink(navLinks, features.albums, 'AlbumList', 'Albums');
    navLinks = addNavLink(navLinks, features.libraries, 'Libraries', 'Libraries');

    if (settings.spotify.useSpotify) {
      navLinks = addNavLink(navLinks, spotifyFeatures.albums, 'SpotifyAlbums', 'Spotify Albums');
      navLinks = addNavLink(navLinks, spotifyFeatures.newReleases, 'NewReleases', 'New Releases');
      navLinks = addNavLink(navLinks, spotifyFeatures.categories, 'Categories', 'Categories');
    }

    navLinks = addNavLink(navLinks, features.tracks, 'Tracks', 'Tracks');
    navLinks = addNavLink(navLinks, features.playlists, 'Playlists', 'Playlists');
    navLinks = addNavLink(navLinks, features.queue, 'Queue', 'Queue');

    if (!isScreenSmall) {
      navLinks = addNavLink(navLinks, features.settings, 'Settings', 'Settings');
    }
  }
  return navLinks;
}

export default NavigationButtons;
