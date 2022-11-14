import Nav from 'react-bootstrap/Nav';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import { ArrowClockwise, Funnel, FunnelFill, Grid, Grid3x3, LockFill, UnlockFill, Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import './Jukebox.scss';
import { getSettings } from '../../lib/settings-client';
import { SettingsContext } from './SettingsProvider';

const propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  setTempSearch: PropTypes.func.isRequired,
};

const JukeboxNavRight = ({
  search,
  setSearch,
  selectedLibraries,
  lastModule,
  setIsLocked,
  setIsPinOpen,
  display,
  setDisplay,
}) => {
  const settings = useContext(SettingsContext);
  const { features, preferences } = settings;
  const isScreenSmall = window.innerWidth < 700;
  const navigate = useNavigate();
  const { pathname } = window.location;

  const { navButtonSize } = settings.styles;
  const applyWidth = (navButtonSize === 'large' || navButtonSize === 'medium');

  let height = '35';
  let fontSize = '';

  if (navButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (navButtonSize === 'medium') {
    height = '80';
    fontSize = '40px';
  }

  const searchButtons = () => {
    const searchButton = (
      <Button
        width={applyWidth ? height : ''}
        height={height}
        disabled={features.isLocked}
        onClick={() => {
          setSearch('');
          navigate('/search');
        }}
        content={<Search style={{ fontSize }} />}
      />
    );

    if (search) {
      return (
        <>
          <Button
            width={applyWidth ? height : ''}
            height={height}
            disabled={features.isLocked}
            onClick={() => {
              setSearch('');
              if (lastModule === 'Albums') {
                navigate('/albums');
              } else if (lastModule === 'Tracks') {
                navigate('/tracks');
              }

            }}
            content={<ArrowClockwise style={{ fontSize }} />}
          />
          {!search && (<Button
            width={applyWidth ? height : ''}
            height={height}
            disabled={features.isLocked}
            onClick={() => setSearch('')}
            content="Search"
          />
          )}
        </>
      );
    }

    return searchButton;
  };

  return (
    <Nav className="ml-auto">
      {!applyWidth && search && !isScreenSmall && <div className="search-result">{`Search Results: ${search}`}</div>}
      {(features.albums || features.tracks) && searchButtons()}
      {!isScreenSmall && !search && features.albums && pathname.includes('/albums') && preferences.showLibraryFilter && (
        <Button
          width={applyWidth ? height : ''}
          height={height}
          disabled={features.isLocked}
          onClick={() => navigate('/filters', { state: { selectedLibraries } })}
          content={selectedLibraries?.length ? <FunnelFill style={{ fontSize }} /> : <Funnel style={{ fontSize }} />}
        />
      )}
      {settings.features.albums && !search && pathname === '/albums' && preferences.showAlbumTable && (
        <Button
          width={applyWidth ? height : ''}
          height={height}
          disabled={features.isLocked}
          onClick={(() => setDisplay(display === 'grid' ? 'covers' : 'grid'))}
          content={display === 'grid' ? <Grid style={{ fontSize }} /> : <Grid3x3 style={{ fontSize }} />}
        />
      )}
      <Button
        width={applyWidth ? height : ''}
        height={height}
        onClick={() => {
          setIsPinOpen(true);
        }}
        content={features.isLocked ? <LockFill style={{ fontSize }} /> : <UnlockFill style={{ fontSize }} />}
      />
    </Nav>
  );
}

JukeboxNavRight.defaultProps = {
  search: '',
};

JukeboxNavRight.propTypes = propTypes;

export default JukeboxNavRight;
