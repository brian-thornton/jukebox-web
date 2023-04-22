import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FC, useContext } from 'react';

import JukeboxNavLeft from './JukeboxNavLeft';
import JukeboxNavRight from './JukeboxNavRight';
import { SettingsContext } from './SettingsProvider';
import { ILibrary } from '../interface';
import './JukeboxHeader.scss';

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
};

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
  const showBrand = (settings?.styles?.navButtonSize !== 'large' && settings?.styles?.navButtonSize !== 'medium');

  return (
    <Navbar className="header-nav-bar" style={{ background: settings?.styles?.headerColor }} fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        {showBrand && (
          <Navbar.Brand
            style={
              {
                color: settings?.styles?.fontColor,
                fontFamily: settings?.styles?.headerFont,
              }
            }
            href="#home"
          >
            {settings?.preferences?.name}
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" >
          <JukeboxNavLeft />
          <JukeboxNavRight
            search={search}
            setSearch={setSearch}
            selectedLibraries={selectedLibraries}
            lastModule={lastModule}
            setIsPinOpen={setIsPinOpen}
            display={display}
            setDisplay={setDisplay}
            clearSearch={clearSearch}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default JukeboxHeader;