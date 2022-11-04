import Nav from 'react-bootstrap/Nav';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import { Funnel, FunnelFill, Grid, Grid3x3, LockFill, UnlockFill } from 'react-bootstrap-icons';
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

  const searchButtons = () => {
    const searchButton = (
      <Button
        disabled={features.isLocked}
        onClick={() => {
          setSearch('');
          navigate('/search');
        }}
        content="Search"
      />
    );

    if (search) {
      return (
        <>
          <Button
            disabled={features.isLocked}
            onClick={() => {
              setSearch('');
              if (lastModule === 'Albums') {
                navigate('/albums');
              } else if (lastModule === 'Tracks') {
                navigate('/tracks');
              }

            }}
            content="Clear"
          />
          {!search && (<Button
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
      {search && !isScreenSmall && <div className="search-result">{`Search Results: ${search}`}</div>}
      {(features.albums || features.tracks) && searchButtons()}
      {!isScreenSmall && features.albums && pathname.includes('/albums') && preferences.showLibraryFilter && (
        <Button
          disabled={features.isLocked}
          onClick={() => navigate('/filters', { state: { selectedLibraries } })}
          content={selectedLibraries?.length ? <FunnelFill /> : <Funnel />}
        />
      )}
      {settings.features.albums && pathname === '/albums' && preferences.showAlbumTable && (
        <Button
          disabled={features.isLocked}
          onClick={(() => setDisplay(display === 'grid' ? 'covers' : 'grid'))}
          content={display === 'grid' ? <Grid /> : <Grid3x3 />}
        />
      )}
      <Button
        onClick={() => {
          setIsPinOpen(true);
        }}
        content={features.isLocked ? <LockFill /> : <UnlockFill />}
      />
    </Nav>
  );
}

JukeboxNavRight.defaultProps = {
  search: '',
};

JukeboxNavRight.propTypes = propTypes;

export default JukeboxNavRight;
