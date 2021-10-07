import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Button as ReactButton } from 'react-bootstrap';
import { SettingsContext } from './layout/SettingsProvider';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  isToggle: PropTypes.bool,
  isToggled: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

function Button({
  onClick,
  content,
  icon,
  disabled,
  isToggle,
  isToggled,
  height,
  width,
}) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const buttonStyle = {
    background: settings.styles.buttonBackgroundColor,
    fontWeight: settings.styles.buttonFontWeight,
    color: settings.styles.buttonFontColor,
    fontFamily: settings.styles.buttonFont,
    float: 'right',
  };

  if (isToggle && isToggled) {
    // TODO: Make these colors configurable.
    buttonStyle.background = '#7CFC00';
  } else if (isToggle && !isToggled) {
    buttonStyle.background = '#FF0000';
  }

  if (width) {
    buttonStyle.minWidth = `${width}px`;
  }

  if (height) {
    buttonStyle.minHeight = `${height}px`;
  }

  const buttonContent = (isScreenSmall && icon) ? icon : content;
  return <ReactButton disabled={disabled} style={buttonStyle} className="button" variant="outline-light" onClick={onClick}>{buttonContent}</ReactButton>;
}

Button.propTypes = propTypes;

Button.defaultProps = {
  content: '',
  icon: <React.Fragment />,
  disabled: false,
  isToggle: false,
  isToggled: false,
  height: '',
  width: '',
};

export default Button;
