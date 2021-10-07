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
import { SettingsContext } from './SettingsProvider';

function ControlButtons({
  isScreenSmall,
  setIsSmallSearchEnabled,
}) {
  const settings = useContext(SettingsContext);
  const { buttonBackgroundColor, buttonFontWeight, buttonFontColor } = settings.styles;
  const buttons = [];
  const { features } = settings;

  const addControlButton = (feature, name, handler) => {
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
    addControlButton(features.play, 'Play', next);
    addControlButton(features.next, 'Next', next);
    addControlButton(features.stop, 'Stop', stop);
  }

  if (isScreenSmall) {
    buttons.push(<Button onClick={up} content={<VolumeUp className="volume-icon" />} />);
    buttons.push(<Button onClick={down} content={<VolumeDown className="volume-icon" />} />);
  } else {
    addControlButton(features.volume, 'Volume Up', up);
    addControlButton(features.volume, 'Volume Down', down);
  }

  return buttons;
}

export default ControlButtons;
