import { PropTypes } from 'prop-types';
import React, { useState, useContext } from 'react';
import {
  Navbar,
  Nav,
} from 'react-bootstrap';
import { Funnel, FunnelFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import FilterModal from './FilterModal';
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
  setMode,
  setCurrentAlbum,
  setSelectedLibraries,
  selectedLibraries,
}) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleFilterModalClose = () => {
    setIsFilterOpen(false);
  }

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
            onClick={() => setSearch('')}
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
        <Button
          onClick={() => setIsFilterOpen(true)}
          content={selectedLibraries?.length ? <FunnelFill /> : <Funnel />}
        />
        {isFilterOpen && (
          <FilterModal
            selectedLibraries={selectedLibraries}
            setSelectedLibraries={setSelectedLibraries}
            handleClose={handleFilterModalClose}
            isOpen={true}
          />
        )}
      </Navbar>
    </>
  );
}

JukeboxHeader.defaultProps = {
  search: '',
};

JukeboxHeader.propTypes = propTypes;

export default JukeboxHeader;
