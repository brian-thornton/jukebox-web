import React from 'react';
import {
  ChevronDoubleRight,
  Play,
  Search,
  VolumeUp,
  VolumeDown,
  XOctagonFill,
} from 'react-bootstrap-icons';
import VolumeClient from '../lib/volume-client';

import Button from './Button';
import QueueClient from '../lib/queue-client';

function ControlButtons({
  isScreenSmall,
  settings,
  setIsSmallSearchEnabled,
}) {
  const addControlButton = (buttons, feature, name, handler) => {
    if (feature) {
      buttons.push((
        <Button
          style={{ background: settings.styles.buttonBackgroundColor, fontWeight: settings.styles.buttonFontWeight, color: settings.styles.buttonFontColor }}
          content={name}
          onClick={handler}
        />
      ));
    }

    return buttons;
  };

  let buttons = [];
  if (settings) {
    const { features } = settings;

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
      buttons.push(<Button onClick={QueueClient.next} content={<Play className="volume-icon" />} />);
      buttons.push(<Button onClick={QueueClient.next} content={<ChevronDoubleRight className="volume-icon" />} />);
      buttons.push(<Button onClick={QueueClient.stop} content={<XOctagonFill className="volume-icon" />} />);
    } else {
      buttons = addControlButton(buttons, features.play, 'Play', QueueClient.next);
      buttons = addControlButton(buttons, features.next, 'Next', QueueClient.next);
      buttons = addControlButton(buttons, features.stop, 'Stop', QueueClient.stop);
    }

    if (isScreenSmall) {
      buttons.push(<Button onClick={VolumeClient.up} content={<VolumeUp className="volume-icon" />} />);
      buttons.push(<Button onClick={VolumeClient.down} content={<VolumeDown className="volume-icon" />} />);
    } else {
      buttons = addControlButton(buttons, features.volume, 'Volume Up', VolumeClient.up);
      buttons = addControlButton(buttons, features.volume, 'Volume Down', VolumeClient.down);
    }
  }

  return buttons;
}

export default ControlButtons;
