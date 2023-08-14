import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FC, useState, useCallback, useContext } from 'react';
import { debounce } from 'lodash';
import { XSquare } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';

import ControlButtons from './ControlButtons/ControlButtons';
import AnimatedMeter from '../common/AnimatedMeter/AnimatedMeter';
import { SettingsContext } from './SettingsProvider';
import Button from '../Button';

import './Jukebox.scss';

interface IJukeboxFooter {
  nowPlaying: string,
  setSearch: Function,
  mediaType: string,
  setMediaType: Function,
};

const JukeboxFooter: FC<IJukeboxFooter> = ({
  setSearch,
  nowPlaying,
  mediaType,
  setMediaType,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall, search, styles } = settings || {};
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

    return <div className="now-playing" style={{ fontFamily: styles?.footerFont }}><FormattedMessage id="now_playing" values={{ track: nowPlaying }} /></div>;
  };

  const footerContent = () => {
    return isSmallSearchEnabled ? (
        <Nav className="ml-auto">
          <Button
            onClick={() => {
              // @ts-ignore
              document?.activeElement?.blur();
              setIsSmallSearchEnabled(false);
            }}
            icon={<XSquare className="volume-icon" />}
          />
          <input type="text" onChange={event => debouncedSearch(event.target.value)} />
        </Nav>
      ) : (
      <Nav className="ml-auto">
        <ControlButtons
          mediaType={mediaType}
          setMediaType={setMediaType}
        />
      </Nav>
    );
  };

  return (
    <Navbar fixed="bottom" collapseOnSelect style={{ background: styles?.footerColor }} variant="dark">
      {nowPlaying && <AnimatedMeter />}
      {nowPlaying && nowPlayingText()}
      {footerContent()}
    </Navbar>
  );
};

export default JukeboxFooter;
