import Nav from 'react-bootstrap/Nav';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import { Funnel, FunnelFill, LockFill, UnlockFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import './Jukebox.scss';
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
}) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const navigate = useNavigate();

  const searchButtons = () => {
    const searchButton = (
      <Button
        disabled={settings.features.isLocked}
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
            disabled={settings.features.isLocked}
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
            disabled={settings.features.isLocked}
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
      {!isScreenSmall && (settings.features.albums || settings.features.tracks) && searchButtons()}
      {!isScreenSmall && settings.features.albums && (
        <Button
          disabled={settings.features.isLocked}
          onClick={() => navigate('/filters', { state: { selectedLibraries } })}
          content={selectedLibraries?.length ? <FunnelFill /> : <Funnel />}
        />
      )}
      <Button
        onClick={() => {
          setIsPinOpen(true);
          setIsLocked(!settings.features.isLocked);
        }}
        content={settings.features.isLocked ? <LockFill /> : <UnlockFill />}
      />
    </Nav>
  );
}

JukeboxNavRight.defaultProps = {
  search: '',
};

JukeboxNavRight.propTypes = propTypes;

export default JukeboxNavRight;
