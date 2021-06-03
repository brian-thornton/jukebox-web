import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';

import { SettingsContext } from './Jukebox';

function NavigationButtons({
  isScreenSmall,
  setMode,
  setCurrentAlbum,
}) {
  const settings = useContext(SettingsContext);
  let navLinks = [];
  const { spotify, features } = settings;
  const { spotifyFeatures } = spotify;

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

  navLinks = addNavLink(navLinks, features.albums, 'AlbumList', 'Albums');

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

  return navLinks;
}

export default NavigationButtons;
