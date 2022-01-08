import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';

import { SettingsContext } from './SettingsProvider';

function NavigationButtons({
  isScreenSmall,
  setCategory,
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
            setCategory(navName);
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

  settings.categories.map((c) => addNavLink(features.albums, 'AlbumList', c));
  addNavLink(features.tracks, 'Tracks', 'Tracks');
  addNavLink(features.playlists, 'Playlists', 'Playlists');
  addNavLink(features.queue, 'Queue', 'Queue');

  if (!isScreenSmall) {
    addNavLink(features.settings, 'Settings', 'Settings');
  }

  return navLinks;
}

export default NavigationButtons;
