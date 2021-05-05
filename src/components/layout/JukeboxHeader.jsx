import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Button,
} from 'react-bootstrap';

//import '../App.css';
import SearchModal from './SearchModal';
import NavigationButtons from './NavigationButtons';

import './Jukebox.css';

function JukeboxHeader({settings, search, setSearch, setTempSearch, mode, setMode, currentAlbum, setCurrentAlbum, resetPage }) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const isScreenSmall = window.innerWidth < 700;

  const handleSearch = (searchText) => {
    setIsSearchModalOpen(false);
    setSearch(searchText);
  };

  const searchResults = () => {
    if (search && !isScreenSmall) {
      return (
        <div className="search-result">
          {`Search Results: ${search}`}
        </div>
      );
    }

    return <React.Fragment />;
  };

  const brand = () => {
    if (isScreenSmall) {
      return <React.Fragment />;
    }

    return <Navbar.Brand href="#home" style={{ color: settings.styles.fontColor }}>{settings.preferences.name}</Navbar.Brand>;
  };

  const buttonStyle = {
    background: settings.styles.buttonBackgroundColor,
    fontWeight: settings.styles.buttonFontWeight,
    color: settings.styles.buttonFontColor
  };

  const searchButton = () => {
    if (isScreenSmall) {
      return <React.Fragment />;
    }

    if (search) {
      return (
        <React.Fragment>
          <Button
            style={buttonStyle}
            className="button"
            variant="outline-light"
            onClick={() => {
              resetPage();
              setSearch('');
              setTempSearch('');
            }}
          >
            Clear
          </Button>
          <Button style={buttonStyle} className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>
        </React.Fragment>
      );
    }

    return <Button style={buttonStyle} className="button" variant="outline-light" onClick={() => setIsSearchModalOpen(true)}>Search</Button>;
  };


  if (settings) {
    return (
      <React.Fragment>
        <Navbar fixed="top" collapseOnSelect variant="dark" style={{ background: settings.styles.headerColor }}>
          {brand()}
          <Nav className="mr-auto">
            <NavigationButtons
              settings={settings}
              isScreenSmall={isScreenSmall}
              setMode={setMode}
              setCurrentAlbum={setCurrentAlbum}
            />
          </Nav>
          {searchResults()}
          {searchButton()}
        </Navbar>
        <SearchModal
          isOpen={isSearchModalOpen}
          handleClose={handleSearch}
          search={search}
          settings={settings}
        />
      </React.Fragment>
    );
  }

  return <React.Fragment />;
}

export default JukeboxHeader;
