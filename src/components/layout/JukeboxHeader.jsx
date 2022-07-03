import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import { Funnel, FunnelFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
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
}) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const navigate = useNavigate();

  const searchButtons = () => {
    const searchButton = (
      <Button
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
    <Navbar style={{ marginBottom: '0px', background: settings.styles.headerColor }} fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand
          style={{ color: settings.styles.fontColor, fontFamily: settings.styles.headerFont }}
          href="#home">{settings.preferences.name}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href="/albums">Albums</Nav.Link>
            {settings.categories.map((c) => {
              return <>{c !== 'Albums' && <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href={`/albums/categories/${c.replace(' ', '%20')}`}>{c}</Nav.Link>}</>;
            })}
            <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href="/tracks">Tracks</Nav.Link>
            <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href="/playlists">Playlists</Nav.Link>
            <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href="/queue">Queue</Nav.Link>
            <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href="/settings">Settings</Nav.Link>
            {isScreenSmall && <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href="/filters">Filters</Nav.Link>}
            {isScreenSmall && <Nav.Link style={{ fontFamily: settings.styles.headerFont }} href="/search">Search</Nav.Link>}
          </Nav>
          <Nav className="ml-auto">
            {search && !isScreenSmall && <div className="search-result">{`Search Results: ${search}`}</div>}
            {!isScreenSmall && searchButtons()}
            {!isScreenSmall && (
              <Button
                onClick={() => navigate('/filters', { state: { selectedLibraries } })}
                content={selectedLibraries?.length ? <FunnelFill /> : <Funnel />}
              />
            )}
          </Nav>
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
