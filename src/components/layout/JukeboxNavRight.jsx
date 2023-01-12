import Nav from 'react-bootstrap/Nav';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import {
  ArrowClockwise,
  Funnel,
  FunnelFill,
  Grid,
  Grid3x3,
  LockFill,
  UnlockFill,
  Search,
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import './Jukebox.scss';
import { SettingsContext } from './SettingsProvider';
import { Libraries } from '../shapes';

const propTypes = {
  setSearch: PropTypes.func.isRequired,
  setDisplay: PropTypes.func.isRequired,
  setIsPinOpen: PropTypes.func.isRequired,
  lastModule: PropTypes.string.isRequired,
  selectedLibraries: Libraries,
};

const JukeboxNavRight = ({
  setSearch,
  selectedLibraries,
  lastModule,
  setIsPinOpen,
  setDisplay,
  display,
  search,
  clearSearch,
}) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall, preferences } = settings;
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
    height = '70';
    fontSize = '30px';
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
              clearSearch();
              if (lastModule === 'Albums') {
                navigate('/albums');
              } else if (lastModule === 'Tracks') {
                navigate('/tracks');
              }
            }}
            content={<ArrowClockwise style={{ fontSize }} />}
          />
          {!search && (
            <Button
              width={applyWidth ? height : ''}
              height={height}
              disabled={features.isLocked}
              onClick={() => setSearch('')}
              content={<FormattedMessage id="search" />}
            />
          )}
        </>
      );
    }

    return searchButton;
  };

  const locked = <LockFill style={{ fontSize }} />;
  const unlocked = <UnlockFill style={{ fontSize }} />;
  const funnelFill = <FunnelFill style={{ fontSize }} />;
  const funnel = <Funnel style={{ fontSize }} />;

  return (
    <Nav className="ml-auto">
      {!applyWidth && search && !isScreenSmall && <div className="search-result"><FormattedMessage id="search_results" values={{search}} /></div>}
      {(features.albums || features.tracks) && searchButtons()}
      {!isScreenSmall && !search && !applyWidth && features.albums && pathname.includes('/albums') && preferences.showLibraryFilter && (
        <Button
          width={applyWidth ? height : ''}
          height={height}
          disabled={features.isLocked}
          onClick={() => navigate('/filters', { state: { selectedLibraries } })}
          content={selectedLibraries?.length ? funnelFill : funnel}
        />
      )}
      {settings.features.albums && !applyWidth && !search && pathname === '/albums' && preferences.showAlbumTable && (
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
        content={features.isLocked ? locked : unlocked}
      />
    </Nav>
  );
};

JukeboxNavRight.defaultProps = {
  search: '',
  selectedLibraries: [],
};

JukeboxNavRight.propTypes = propTypes;

export default JukeboxNavRight;
