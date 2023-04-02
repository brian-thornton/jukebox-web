import Nav from 'react-bootstrap/Nav';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { SettingsContext } from './SettingsProvider';
import Button from '../Button';

const JukeboxNavLeft = () => {
  const location = useLocation();
  const settings = useContext(SettingsContext);
  const { isScreenSmall, styles, features } = settings;
  const { headerFont } = styles;
  const { navButtonSize } = settings.styles;
  let height = '35';
  let fontSize = '';

  if (navButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (navButtonSize === 'medium') {
    height = '70';
    fontSize = '30px';
  }

  const navButton = feature => (
    <>
      {features[feature] && (
        <Button
          key={`${feature}-nav`}
          height={height}
          style={{
            fontSize,
            fontFamily: settings.buttonFont,
            marginTop: '0',
            marginBottom: '0',
          }}
          isSelected={location.pathname === `/${feature}`}
          disabled={features.isLocked}
          content={<FormattedMessage id={feature} />}
          onClick={() => window.location.replace(`/${feature}`)}
        />
      )}
    </>
  );

  return (
    <>
      {(!styles || !styles.navButtonType || styles.navButtonType !== 'buttons' || isScreenSmall) && (
        <Nav className="me-auto">
          {features.albums && (
            <>
              <Nav.Link disabled={features.isLocked} style={{ fontFamily: styles.headerFont }} href="/albums"><FormattedMessage id="albums" /></Nav.Link>
              {settings.categories.map(c => (
                <>
                  {c !== 'Albums' && (
                    <Nav.Link
                      disabled={features.isLocked}
                      style={{ fontFamily: styles.headerFont }}
                      href={`/albums/categories/${c.category.replace(' ', '%20')}`}
                    >
                      {c.category}
                    </Nav.Link>
                  )
                  }
                </>
              ))}
            </>
          )}
          {features.tracks && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/tracks"><FormattedMessage id="tracks" /></Nav.Link>}
          {features.tracks && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/genres"><FormattedMessage id="genres" /></Nav.Link>}
          {features.playlists && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/playlists"><FormattedMessage id="playlists" /></Nav.Link>}
          {features.playlists && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/radio"><FormattedMessage id="radio" /></Nav.Link>}
          {features.queue && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/queue"><FormattedMessage id="queue" /></Nav.Link>}
          {features.settings && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/settings"><FormattedMessage id="settings" /></Nav.Link>}
          {features.albums && isScreenSmall && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/filters"><FormattedMessage id="filters" /></Nav.Link>}
          {(features.albums || features.tracks) && isScreenSmall && <Nav.Link disabled={features.isLocked} style={{ fontFamily: headerFont }} href="/search"><FormattedMessage id="search" /></Nav.Link>}
        </Nav>
      )}
      {styles.navButtonType === 'buttons' && !isScreenSmall && (
        <Nav className="me-auto" style={{ marginBottom: '0' }}>
          {features.albums && (
            <>
              {navButton('albums')}
              {settings.categories.map(c => (
                <>
                  {c !== 'Albums' && (
                    <Button
                      style={{
                        fontSize,
                        fontFamily: settings.buttonFont,
                        marginTop: '0',
                        marginBottom: '0',
                      }}
                      disabled={features.isLocked}
                      content={c.category}
                      onClick={() => window.location.replace(`/albums/categories/${c.category.replace(' ', '%20')}`)}
                    />
                  )}
                </>
              ))}
            </>
          )}
          {features.tracks && navButton('tracks')}
          {features.tracks && navButton('genres')}
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
};

export default JukeboxNavLeft;
