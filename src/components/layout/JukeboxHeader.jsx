import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import JukeboxNavLeft from './JukeboxNavLeft';
import JukeboxNavRight from './JukeboxNavRight';
import './Jukebox.css';
import { SettingsContext } from './SettingsProvider';

const propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  setTempSearch: PropTypes.func.isRequired,
};

const JukeboxHeader = ({
  search,
  setSearch,
  selectedLibraries,
  lastModule,
  setIsLocked,
  setIsPinOpen,
}) => {
  const settings = useContext(SettingsContext);

  return (
    <Navbar style={{ marginBottom: '0px', background: settings.styles.headerColor }} fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand
          style={{ color: settings.styles.fontColor, fontFamily: settings.styles.headerFont }}
          href="#home">{settings.preferences.name}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <JukeboxNavLeft />
          <JukeboxNavRight
            search={search}
            setSearch={setSearch}
            selectedLibraries={selectedLibraries}
            lastModule={lastModule}
            setIsLocked={setIsLocked}
            setIsPinOpen={setIsPinOpen}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

JukeboxHeader.defaultProps = {
  search: '',
};

JukeboxHeader.propTypes = propTypes;

export default JukeboxHeader;
