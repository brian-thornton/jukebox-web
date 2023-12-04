import { FC, useContext, useState } from 'react';

import JukeboxNavLeft from '../JukeboxNavLeft';
import JukeboxNavRight from '../JukeboxNavRight';
import { SettingsContext } from '../SettingsProvider';
import { ILibrary } from '../../interface';
import styles from './JukeboxHeader.module.css';
import Header from '../Header/Header';
import NavLink from '../NavLink';

interface IJukeboxHeader {
  setSearch: Function,
  selectedLibraries: [ILibrary],
  lastModule: string,
  setIsLocked: Function,
  setIsPinOpen: Function,
  setDisplay: Function,
  display: string,
  search: string,
  clearSearch: Function,
}

const JukeboxHeader: FC<IJukeboxHeader> = ({
  setSearch,
  selectedLibraries,
  lastModule,
  setIsLocked,
  setIsPinOpen,
  setDisplay,
  display,
  search,
  clearSearch,
}) => {
  const settings = useContext(SettingsContext);
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);

  return (
    <Header
      brand={settings?.preferences?.name}
      leftContent={<JukeboxNavLeft />}
      mobileContent={<>
        <NavLink feature='Albums' />
        <NavLink feature='Tracks' />
        <NavLink feature='Genres' />
        <NavLink feature='Playlists' />
        <NavLink feature='Radio' />
        <NavLink feature='Queue' />
        <NavLink feature='Settings' />
      </>}
      rightContent={<JukeboxNavRight
        search={search}
        setSearch={setSearch}
        selectedLibraries={selectedLibraries}
        lastModule={lastModule}
        setIsPinOpen={setIsPinOpen}
        display={display}
        setDisplay={setDisplay}
        clearSearch={clearSearch}
        isHamburgerClicked={isHamburgerClicked}
      />}
    />
  );
};

export default JukeboxHeader;
