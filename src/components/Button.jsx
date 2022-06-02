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
  style,
  id,
}) {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const buttonStyle = {
    background: style?.buttonBackgroundColor || settings.styles.buttonBackgroundColor,
    fontWeight: settings.styles.buttonFontWeight,
    color: settings.styles.buttonFontColor,
    fontFamily: style?.fontFamily || settings.styles.buttonFont,
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

  const buttonContent = ((isScreenSmall && icon) || (!content && icon)) ? icon : content;
  return <ReactButton id={id} disabled={disabled} style={buttonStyle} className="button" variant="outline-light" onClick={onClick}>{content || icon}</ReactButton>;
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
