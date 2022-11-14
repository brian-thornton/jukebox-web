import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const ControlButton = ({ disabled, height, width = "275", onClick, text, isSelected, style }) => {
  const settings = useContext(SettingsContext);
  const { styles } = settings;

  const controlButtonStyle = {
    background: styles.controlButtonBackgroundColor || styles.buttonBackgroundColor,
    color: styles.fontColor,
    minHeight: height ? `${height}px` : '65px',
    fontFamily: styles.buttonFont,
    width: '100%',
    fontSize: style?.fontSize,
  };

  return (
    <Button
      width={width}
      height={height}
      block
      disabled={disabled}
      variant="outline-light"
      style={controlButtonStyle}
      onClick={onClick}
      content={text}
      isSelected={isSelected}
    />
  );
}

ControlButton.defaultProps = {
  disabled: false,
};

ControlButton.propTypes = propTypes;

export default ControlButton;
