import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { PropTypes } from 'prop-types';
import React, { useState, useCallback, useContext } from 'react';
import { debounce } from 'lodash';
import { XSquare } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';

import ControlButtons from './ControlButtons';
import AnimatedMeter from '../common/AnimatedMeter';
import { SettingsContext } from './SettingsProvider';

import './Jukebox.scss';

const propTypes = {
  nowPlaying: PropTypes.string,
  setSearch: PropTypes.func,
};

const JukeboxFooter = ({
  setSearch,
  nowPlaying,
  mediaType,
  setMediaType,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall, search } = settings;
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

    return <div className="now-playing" style={{ fontFamily: settings.styles.footerFont }}><FormattedMessage id="now_playing" values={{ track: nowPlaying }} /></div>;
  };

  const footerContent = () => {
    if (isSmallSearchEnabled) {
      return (
        <Nav className="ml-auto">
          <Button
            className="button"
            variant="outline-light"
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
          mediaType={mediaType}
          setMediaType={setMediaType}
          setIsSmallSearchEnabled={setIsSmallSearchEnabled}
        />
      </Nav>
    );
  };

  return (
    <Navbar fixed="bottom" collapseOnSelect style={{ background: settings.styles.footerColor }} variant="dark">
      {nowPlaying && <AnimatedMeter />}
      {nowPlaying && nowPlayingText()}
      {footerContent()}
    </Navbar>
  );
};

JukeboxFooter.defaultProps = {
  nowPlaying: '',
  setSearch: null,
};

JukeboxFooter.propTypes = propTypes;

export default JukeboxFooter;
