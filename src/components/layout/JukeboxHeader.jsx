import { PropTypes } from 'prop-types';
import React, { useState, useContext } from 'react';
import {
  Navbar,
  Nav,
} from 'react-bootstrap';

import Button from '../Button';
import SearchModal from './SearchModal';
import NavigationButtons from './NavigationButtons';

import './Jukebox.css';
import { SettingsContext } from './SettingsProvider';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  setTempSearch: PropTypes.func.isRequired,
};

function JukeboxHeader({
  search,
  setCategory,
  setSearch,
  setTempSearch,
  setMode,
  setCurrentAlbum,
}) {
  const settings = useContext(SettingsContext);
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

    return <></>;
  };

  const brand = () => {
    if (isScreenSmall) {
      return <></>;
    }

    return <Navbar.Brand href="#home" style={{ color: settings.styles.fontColor, fontFamily: settings.styles.headerFont }}>{settings.preferences.name}</Navbar.Brand>;
  };

  const searchButtons = () => {
    if (isScreenSmall) {
      return <></>;
    }

    const searchButton = (
      <Button
        onClick={() => setIsSearchModalOpen(true)}
        content="Search"
      />
    );

    if (search) {
      return (
        <>
          <Button
            onClick={() => {
              setSearch('');
              setTempSearch('');
            }}
            content="Clear"
          />
          {searchButtons}
        </>
      );
    }

    return searchButton;
  };


  return (
    <>
      <Navbar fixed="top" collapseOnSelect variant="dark" style={{ background: settings.styles.headerColor }}>
        {brand()}
        <Nav className="mr-auto">
          <NavigationButtons
            setCategory={setCategory}
            isScreenSmall={isScreenSmall}
            setMode={setMode}
            setCurrentAlbum={setCurrentAlbum}
          />
        </Nav>
        {searchResults()}
        {searchButtons()}
      </Navbar>
      <SearchModal
        isOpen={isSearchModalOpen}
        handleClose={handleSearch}
        search={search}
      />
    </>
  );
}

JukeboxHeader.defaultProps = {
  search: '',
};

JukeboxHeader.propTypes = propTypes;

export default JukeboxHeader;
