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
  const { playlists, tracks, queue, albums } = features || {};
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

  const navLink = feature => (
    <Nav.Link
      disabled={features.isLocked}
      style={{ fontFamily: headerFont }}
      href={`/${feature}`}
    >
      <FormattedMessage id={feature} />
    </Nav.Link>
  )

  return (
    <>
      {(!styles || !styles.navButtonType || styles.navButtonType !== 'buttons' || isScreenSmall) && (
        <Nav className="me-auto">
          {albums && (
            <>
              {navLink('albums')}
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
          {tracks && navLink('tracks')}
          {tracks && navLink('genres')}
          {playlists && navLink('playlists')}
          {playlists && navLink('radio')}
          {queue && navLink('queue')}
          {features.settings && navLink('settings')}
          {albums && isScreenSmall && navLink('filters')}
          {(albums || features.tracks) && isScreenSmall && navLink('search')}
        </Nav>
      )}
      {styles.navButtonType === 'buttons' && !isScreenSmall && (
        <Nav className="me-auto" style={{ marginBottom: '0' }}>
          {albums && (
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
          {tracks && navButton('tracks')}
          {tracks && navButton('genres')}
          {playlists && navButton('playlists')}
          {playlists && navButton('radio')}
          {queue && navButton('queue')}
          {features.settings && navButton('settings')}
          {albums && isScreenSmall && navButton('filters')}
          {(albums || tracks) && isScreenSmall && navButton('search')}
        </Nav>
      )}
    </>
  );
};

export default JukeboxNavLeft;
