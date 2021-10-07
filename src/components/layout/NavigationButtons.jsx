import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';

import { SettingsContext } from './SettingsProvider';

function NavigationButtons({
  isScreenSmall,
  setMode,
  setCurrentAlbum,
}) {
  const settings = useContext(SettingsContext);
  const navLinks = [];
  const { features } = settings;

  const addNavLink = (feature, navKey, navName) => {
    if (feature) {
      navLinks.push(
        <Nav.Link
          style={{ fontFamily: settings.styles.headerFont }}
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
  };

  addNavLink(features.albums, 'AlbumList', 'Albums');
  addNavLink(features.tracks, 'Tracks', 'Tracks');
  addNavLink(features.playlists, 'Playlists', 'Playlists');
  addNavLink(features.queue, 'Queue', 'Queue');

  if (!isScreenSmall) {
    addNavLink(features.settings, 'Settings', 'Settings');
  }

  return navLinks;
}

export default NavigationButtons;
