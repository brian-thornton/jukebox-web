import { PropTypes } from 'prop-types';
import React, { useState, useCallback, useContext } from 'react';
import {
  Navbar,
  Nav,
  Button,
} from 'react-bootstrap';
import { debounce } from 'lodash';
import { XSquare } from 'react-bootstrap-icons';

import ControlButtons from './ControlButtons';
import { SettingsContext } from './SettingsProvider';

import './Jukebox.css';

const propTypes = {
  nowPlaying: PropTypes.string,
  search: PropTypes.string,
  setSearch: PropTypes.func,
};

function JukeboxFooter({
  search,
  setSearch,
  nowPlaying,
  pagingButtons,
}) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const [isSmallSearchEnabled, setIsSmallSearchEnabled] = useState(false);

  const debouncedSearch = useCallback(
    debounce((tempSearch) => {
      if (tempSearch.length > 3) {
        if (search) {
          setSearch(`${search}${tempSearch}`);
        } else {
          setSearch(tempSearch);
        }
      }
    }, 500), [],
  );

  const nowPlayingText = () => {
    if (isScreenSmall) {
      return <></>;
    }

    return <div className="now-playing" style={{ fontFamily: settings.styles.footerFont }}>{`Now Playing: ${nowPlaying}`}</div>;
  };

  const footerContent = () => {
    const props = {
      className: 'button',
      variant: 'outline-light',
    };

    if (isSmallSearchEnabled) {
      return (
        <Nav className="ml-auto">
          <Button
            {...props}
            onClick={() => {
              document.activeElement.blur();
              setIsSmallSearchEnabled(false);
            }}
          >
            <XSquare className="volume-icon" />
          </Button>
          <input type="text" onChange={event => debouncedSearch(event.target.value)} />
        </Nav>
      );
    }

    return (
      <Nav className="ml-auto">
        <ControlButtons
          isScreenSmall={isScreenSmall}
          setIsSmallSearchEnabled={setIsSmallSearchEnabled}
        />
      </Nav>
    );
  };

  return (
    <Navbar fixed="bottom" collapseOnSelect style={{ background: settings.styles.footerColor }} variant="dark">
      {nowPlayingText()}
      {pagingButtons}
      {footerContent()}
    </Navbar>
  );
}

JukeboxFooter.defaultProps = {
  nowPlaying: '',
  search: '',
  setSearch: null,
};

JukeboxFooter.propTypes = propTypes;

export default JukeboxFooter;
