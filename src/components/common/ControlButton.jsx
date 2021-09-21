import { Button } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import { SettingsContext } from '../layout/Jukebox';

const propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

function ControlButton({ disabled, onClick, text }) {
  const settings = useContext(SettingsContext);
  const { styles } = settings;

  const controlButtonStyle = {
    background: styles.buttonBackgroundColor,
    color: styles.fontColor,
    minHeight: '65px',
    fontFamily: styles.buttonFont,
  }

  return (
    <Button
      block
      disabled={disabled}
      variant="outline-light"
      style={controlButtonStyle}
      onClick={onClick}>{text}
    </Button>
  );
}

ControlButton.propTypes = propTypes;

export default ControlButton;
