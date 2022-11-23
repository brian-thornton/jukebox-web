import Nav from 'react-bootstrap/Nav';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { SettingsContext } from './SettingsProvider';
import Button from '../Button';

const JukeboxNavLeft = ({ }) => {
  const location = useLocation();
  const settings = useContext(SettingsContext);
  const { styles, features } = settings;
  const isScreenSmall = window.innerWidth < 700;

  const { navButtonSize } = settings.styles;
  let height = '35';
  let fontSize = '';

  if (navButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (navButtonSize === 'medium') {
    height = '70'
    fontSize = '30px';
  }

  const navButton = (feature) => {
    return (
      <>
        {features[feature] && (
          <Button
            height={height}
            style={{ fontSize: fontSize, fontFamily: settings.buttonFont, marginTop: '0', marginBottom: '0' }}
            isSelected={location.pathname === `/${feature}`}
            disabled={features.isLocked}
            content={feature.charAt(0).toUpperCase() + feature.slice(1)}
            onClick={() => window.location.replace(`/${feature}`)}
          />
        )}
      </>
    )
  };

  return (
    <>
      {(!styles || !styles.navButtonType || styles.navButtonType !== "buttons" || isScreenSmall) && (
        <Nav className="me-auto">
          {features.albums && (
            <>
              <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/albums">Albums</Nav.Link>
              {settings.categories.map((c) => {
                return <>{c !== 'Albums' && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href={`/albums/categories/${c.replace(' ', '%20')}`}>{c}</Nav.Link>}</>;
              })}
            </>
          )}
          {features.tracks && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/tracks">Tracks</Nav.Link>}
          {features.playlists && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/playlists">Playlists</Nav.Link>}
          {features.playlists && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/radio">Radio</Nav.Link>}
          {features.queue && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/queue">Queue</Nav.Link>}
          {features.settings && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/settings">Settings</Nav.Link>}
          {features.albums && isScreenSmall && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/filters">Filters</Nav.Link>}
          {(features.albums || features.tracks) && isScreenSmall && <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/search">Search</Nav.Link>}
        </Nav>
      )}
      {styles.navButtonType === "buttons" && !isScreenSmall && (
        <Nav className="me-auto" style={{marginBottom: '0'}}>
          {features.albums && (
            <>
              {navButton('albums')}
              {settings.categories.map((c) => {
                return <>{c !== 'Albums' && (
                  <Button
                    style={{ marginTop: '0', marginBottom: '0' }}
                    disabled={features.isLocked}
                    content={c} onClick={() => window.location.replace(`/albums/categories/${c.replace(' ', '%20')}`)}
                  />
                )}</>
              })}
            </>
          )}
          {features.tracks && navButton('tracks')}
          {features.playlists && navButton('playlists')}
          {features.playlists && navButton('radio')}
          {features.queue && navButton('queue')}
          {features.settings && navButton('settings')}
          {features.albums && isScreenSmall && navButton('filters')}
          {(features.albums || features.tracks) && isScreenSmall && navButton('search')}
        </Nav>
      )}
    </>
  );
}

export default JukeboxNavLeft;
