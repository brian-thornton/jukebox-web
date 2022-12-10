import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import JukeboxNavLeft from './JukeboxNavLeft';
import JukeboxNavRight from './JukeboxNavRight';
import { SettingsContext } from './SettingsProvider';
import { Libraries } from '../shapes';

const propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  selectedLibraries: Libraries,
  lastModule: PropTypes.string,
  setIsLocked: PropTypes.func,
  setIsPinOpen: PropTypes.func,
  display: PropTypes.string,
  setDisplay: PropTypes.func,
};

const JukeboxHeader = ({
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

  const { navButtonSize } = settings.styles;
  const showBrand = (navButtonSize !== 'large' && navButtonSize !== 'medium');

  return (
    <Navbar style={{ marginBottom: '0px', background: settings.styles.headerColor }} fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        {showBrand && (
          <Navbar.Brand
            style={
              {
                color: settings.styles.fontColor,
                fontFamily: settings.styles.headerFont,
              }
            }
            href="#home"
          >
            {settings.preferences.name}
          </Navbar.Brand>
        )}
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
            display={display}
            setDisplay={setDisplay}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

JukeboxHeader.defaultProps = {
  search: '',
  selectedLibraries: [],
  lastModule: '',
  setIsLocked: null,
  setIsPinOpen: null,
  display: '',
  setDisplay: null,
};

JukeboxHeader.propTypes = propTypes;

export default JukeboxHeader;
