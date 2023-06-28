import Nav from 'react-bootstrap/Nav';
import { FC, useContext } from 'react';
import {
  Funnel,
  FunnelFill,
  Grid,
  Grid3x3,
  LockFill,
  UnlockFill,
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import './Jukebox.scss';
import { SettingsContext } from './SettingsProvider';
import { ILibrary } from '../interface';
import JukeboxNavSearchButtons from './JukeboxNavSearchButtons';

interface IJukeboxNavRight {
  setSearch: Function,
  setDisplay: Function,
  setIsPinOpen: Function,
  lastModule: string,
  selectedLibraries: Array<ILibrary>,
  display: string,
  search: string,
  clearSearch: Function,
  isHamburgerClicked: boolean,
};

const JukeboxNavRight: FC<IJukeboxNavRight> = ({
  setSearch,
  selectedLibraries,
  lastModule,
  setIsPinOpen,
  setDisplay,
  display,
  search,
  clearSearch,
  isHamburgerClicked,
}) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall, preferences, screen } = settings;
  const navigate = useNavigate();
  const { pathname } = window.location;
  const { navButtonSize } = settings.styles || {};
  const applyWidth = (navButtonSize === 'large' || navButtonSize === 'medium');
  let height = navButtonSize === 'large' ? '100' : '35';
  let fontSize = navButtonSize === 'large' ? '40px' : '';

  if (navButtonSize === 'medium') {
    height = '70';
    fontSize = '30px';
  }

  const locked = <LockFill style={{ fontSize }} />;
  const unlocked = <UnlockFill style={{ fontSize }} />;
  const funnelFill = <FunnelFill style={{ fontSize }} />;
  const funnel = <Funnel style={{ fontSize }} />;

  return (
    <Nav className="ml-auto">
      {!applyWidth && search && !isScreenSmall && <div className="search-result"><FormattedMessage id="search_results" values={{ search }} /></div>}
      {(features?.albums || features?.tracks) && !isHamburgerClicked && (
        <JukeboxNavSearchButtons
          search={search}
          setSearch={setSearch}
          lastModule={lastModule}
          clearSearch={clearSearch}
        />
      )}
      {!isScreenSmall && !search && !applyWidth && features?.albums && pathname.includes('/albums') && preferences?.showLibraryFilter && (
        <Button
          width={applyWidth ? height : ''}
          height={height}
          disabled={features.isLocked}
          onClick={() => navigate('/filters', { state: { selectedLibraries } })}
          content={selectedLibraries?.length ? funnelFill : funnel}
        />
      )}
      {!isScreenSmall && settings?.features?.albums && !applyWidth && !search && pathname === '/albums' && preferences?.showAlbumTable && (
        <Button
          width={applyWidth ? height : ''}
          height={height}
          disabled={features?.isLocked}
          onClick={(() => setDisplay(display === 'grid' ? 'covers' : 'grid'))}
          content={display === 'grid' ? <Grid style={{ fontSize }} /> : <Grid3x3 style={{ fontSize }} />}
        />
      )}
      {!screen?.isMobile && (
        <Button
          width={applyWidth ? height : ''}
          height={height}
          onClick={() => {
            setIsPinOpen(true);
          }}
          content={features?.isLocked ? locked : unlocked}
        />
      )}
    </Nav>
  );
};

export default JukeboxNavRight;
