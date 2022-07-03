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

const Button = ({
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
  hideOnSmall,
  hideOnLarge,
}) => {
  const settings = useContext(SettingsContext);

  const buttonStyle = {
    marginTop: style?.marginTop,
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

  let dynamicClasses = '';
  if (hideOnSmall) {
    dynamicClasses = `${dynamicClasses} d-none d-sm-block`;
  }

  return <ReactButton id={id} disabled={disabled} style={buttonStyle} className={`button ${dynamicClasses}`} variant="outline-light" onClick={onClick}>{content || icon}</ReactButton>;
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
