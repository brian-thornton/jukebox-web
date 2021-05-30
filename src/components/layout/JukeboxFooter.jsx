import React, { useState, useCallback } from 'react';
import {
  Navbar,
  Nav,
  Button,
} from 'react-bootstrap';
import { debounce } from 'lodash';
import { XSquare } from 'react-bootstrap-icons';

import ControlButtons from './ControlButtons';
import { Settings } from '../shapes';

import './Jukebox.css';

const propTypes = {
  settings: Settings.isRequired,
};

function JukeboxFooter({
  search,
  setSearch,
  settings,
  nowPlaying,
}) {
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
      return <React.Fragment />;
    }

    return <div className="now-playing">{`Now Playing: ${nowPlaying}`}</div>;
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
          settings={settings}
          isScreenSmall={isScreenSmall}
          setIsSmallSearchEnabled={setIsSmallSearchEnabled}
        />
      </Nav>
    );
  };

  if (settings) {
    return (
      <Navbar fixed="bottom" collapseOnSelect style={{ background: settings.styles.footerColor }} variant="dark">
        {nowPlayingText()}
        {footerContent()}
      </Navbar>
    );
  }

  return <React.Fragment />;
}

JukeboxFooter.propTypes = propTypes;

export default JukeboxFooter;
