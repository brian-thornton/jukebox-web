import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import ControlButtons from '../../ControlButtons/ControlButtons';
import AnimatedMeter from '../../../common/AnimatedMeter/AnimatedMeter';
import { SettingsContext } from '../../SettingsProvider';

import classes from './JukeboxFooter.module.css';

interface IJukeboxFooter {
  nowPlaying: string,
  setSearch: Function,
  mediaType: string,
  setMediaType: Function,
}

const JukeboxFooter: FC<IJukeboxFooter> = ({
  nowPlaying,
  mediaType,
  setMediaType,
}) => {
  const settings = useContext(SettingsContext);
  const { styles } = settings || {};

  const nowPlayingText = () => {
    return (
      <div
        className={classes.nowPlaying}
        style={{ fontFamily: styles?.footerFont }}
      >
        <FormattedMessage id="now_playing" values={{ track: nowPlaying }} />
      </div>
    );
  };

  const footerContent = () => {
    return (
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
