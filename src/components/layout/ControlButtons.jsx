import React, { useContext } from 'react';
import {
  ChevronDoubleRight,
  Play,
  Search,
  VolumeUp,
  VolumeDown,
  XOctagonFill,
} from 'react-bootstrap-icons';

import { up, down } from '../../lib/volume-client';
import Button from '../Button';
import { next, stop } from '../../lib/queue-client';
import { SettingsContext } from './Jukebox';

function ControlButtons({
  isScreenSmall,
  setIsSmallSearchEnabled,
}) {
  const settings = useContext(SettingsContext);
  const { buttonBackgroundColor, buttonFontWeight, buttonFontColor } = settings.styles;
  let buttons = [];
  const { features } = settings;

  const addControlButton = (buttons, feature, name, handler) => {
    if (feature) {
      buttons.push((
        <Button
          style={{
            background: buttonBackgroundColor,
            fontWeight: buttonFontWeight,
            color: buttonFontColor,
          }}
          content={name}
          onClick={handler}
        />
      ));
    }

    return buttons;
  };

  if (isScreenSmall) {
    buttons.push((
      <Button
        onClick={() => {
          document.activeElement.blur();
          setIsSmallSearchEnabled(true);
        }}
        content={<Search className="volume-icon" />}
      />));
  }

  if (isScreenSmall) {
    buttons.push(<Button onClick={next} content={<Play className="volume-icon" />} />);
    buttons.push(<Button onClick={next} content={<ChevronDoubleRight className="volume-icon" />} />);
    buttons.push(<Button onClick={stop} content={<XOctagonFill className="volume-icon" />} />);
  } else {
    buttons = addControlButton(buttons, features.play, 'Play', next);
    buttons = addControlButton(buttons, features.next, 'Next', next);
    buttons = addControlButton(buttons, features.stop, 'Stop', stop);
  }

  if (isScreenSmall) {
    buttons.push(<Button onClick={up} content={<VolumeUp className="volume-icon" />} />);
    buttons.push(<Button onClick={down} content={<VolumeDown className="volume-icon" />} />);
  } else {
    buttons = addControlButton(buttons, features.volume, 'Volume Up', up);
    buttons = addControlButton(buttons, features.volume, 'Volume Down', down);
  }

  return buttons;
}

export default ControlButtons;
