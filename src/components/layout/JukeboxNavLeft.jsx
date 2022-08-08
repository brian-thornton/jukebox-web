import Nav from 'react-bootstrap/Nav';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import './Jukebox.css';
import { SettingsContext } from './SettingsProvider';

const JukeboxNavLeft = ({}) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  return (
    <Nav className="me-auto">
      {settings.features.albums && (
        <>
          <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href="/albums">Albums</Nav.Link>
          {settings.categories.map((c) => {
            return <>{c !== 'Albums' && <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href={`/albums/categories/${c.replace(' ', '%20')}`}>{c}</Nav.Link>}</>;
          })}
        </>
      )}
      {settings.features.tracks && <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href="/tracks">Tracks</Nav.Link>}
      {settings.features.playlists && <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href="/playlists">Playlists</Nav.Link>}
      {settings.features.queue && <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href="/queue">Queue</Nav.Link>}
      {settings.features.settings && <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href="/settings">Settings</Nav.Link>}
      {settings.features.albums && isScreenSmall && <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href="/filters">Filters</Nav.Link>}
      {(settings.features.albums || settings.features.tracks) && isScreenSmall && <Nav.Link disabled={settings.features.isLocked} style={{ fontFamily: settings.styles.headerFont }} href="/search">Search</Nav.Link>}
    </Nav>
  );
}

export default JukeboxNavLeft;
