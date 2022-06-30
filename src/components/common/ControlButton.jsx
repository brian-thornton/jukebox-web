import Button from 'react-bootstrap/Button';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const ControlButton = ({ disabled, height, onClick, text }) => {
  const settings = useContext(SettingsContext);
  const { styles } = settings;

  const controlButtonStyle = {
    background: styles.buttonBackgroundColor,
    color: styles.fontColor,
    minHeight: height ? `${height}px` : '65px',
    fontFamily: styles.buttonFont,
    width: '100%'
  };

  return (
    <Button
      block
      disabled={disabled}
      variant="outline-light"
      style={controlButtonStyle}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

ControlButton.defaultProps = {
  disabled: false,
};

ControlButton.propTypes = propTypes;

export default ControlButton;
