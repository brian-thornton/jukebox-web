import Nav from 'react-bootstrap/Nav';
import { useContext } from 'react';

import { SettingsContext } from '../SettingsProvider';
import NavLink from './NavLink';
import NavButton from './NavButton';
import CategoryButtons from './CategoryButtons';
import CategoryLinks from './CategoryLinks';

const JukeboxNavLeft = () => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall, styles, features } = settings;
  const { playlists, tracks, queue, albums, genres } = features || {};
  const { navButtonSize } = settings.styles;
  const navLink = feature => <NavLink feature={feature} />;
  let height = navButtonSize === 'large' ? '100' : '35';
  let fontSize = navButtonSize === 'large' ? '40px' : '';

  if (navButtonSize === 'medium') {
    height = '70';
    fontSize = '30px';
  }

  const navButton = feature => (
    <>
      {features[feature] && <NavButton feature={feature} />}
    </>
  );

  const navItems = (generator) => (
    <>
      {tracks && generator('tracks')}
      {genres && generator('genres')}
      {playlists && generator('playlists')}
      {playlists && generator('radio')}
      {queue && generator('queue')}
      {features.settings && generator('settings')}
    </>
  );

  return (
    <>
      {(!styles || !styles.navButtonType || styles.navButtonType !== 'buttons' || isScreenSmall) && (
        <Nav className="me-auto">
          {albums && (
            <>
              {navLink('albums')}
              <CategoryLinks />
            </>
          )}
          {navItems(navLink)}
        </Nav>
      )}
      {styles.navButtonType === 'buttons' && !isScreenSmall && (
        <Nav className="me-auto" style={{ marginBottom: '0', marginTop: '5px' }}>
          {albums && (
            <>
              {navButton('albums')}
              <CategoryButtons />
            </>
          )}
          {navItems(navButton)}
        </Nav>
      )}
    </>
  );
};

export default JukeboxNavLeft;
