import { Button as ReactButton } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';

import { SettingsContext } from './layout/SettingsProvider';
import { Style } from './shapes';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  isToggle: PropTypes.bool,
  isToggled: PropTypes.bool,
  isSelected: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
  id: PropTypes.string,
  style: Style,
  hideOnSmall: PropTypes.bool,
};

const Button = ({
  onClick, content, icon, disabled, isToggle, isToggled, isSelected, height, width, style, id,
  hideOnSmall,
}) => {
  const settings = useContext(SettingsContext);
  const [isHover, setIsHover] = useState(false);
  const {
    marginTop,
    marginBottom,
    buttonBackgroundColor,
    fontSize,
    fontFamily,
  } = style;

  const buttonStyle = {
    marginTop,
    marginBottom,
    background: buttonBackgroundColor || settings.styles.buttonBackgroundColor,
    fontSize,
    fontWeight: settings.styles.buttonFontWeight,
    color: settings.styles.buttonFontColor,
    fontFamily: fontFamily || settings.styles.buttonFont,
    float: 'right',
    borderRadius: settings.styles.buttonShape === 'round' ? '35px' : '',
  };

  if (isSelected) {
    buttonStyle.background = settings.styles.activeButtonColor;
  }

  if (isHover || (isToggle && isToggled)) {
    // TODO: Make these colors configurable.
    buttonStyle.background = settings.styles.activeButtonColor;
  } else if (isToggle && !isToggled) {
    buttonStyle.background = settings.styles.buttonBackgroundColor;
  }

  buttonStyle.overflow = 'hidden';
  buttonStyle.whiteSpace = 'nowrap';
  buttonStyle.textOverflow = 'ellipsis';
  // buttonStyle.borderRadius = '35px';

  if (width === '100%') {
    buttonStyle.minWidth = '100%';
    buttonStyle.maxWidth = '100%';
  } else if (width.includes('%')) {
    buttonStyle.minWidth = width;
    buttonStyle.maxWidth = width;
  } else if (width) {
    buttonStyle.minWidth = `${width}px`;
    buttonStyle.maxWidth = `${width}px`;
  }

  if (height) {
    buttonStyle.minHeight = `${height}px`;
  }

  let dynamicClasses = '';
  if (hideOnSmall) {
    dynamicClasses = `${dynamicClasses} d-none d-sm-block`;
  }

  return <ReactButton onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} id={id} disabled={disabled} style={buttonStyle} className={`button ${dynamicClasses}`} variant="outline-light" onClick={onClick}>{content || icon}</ReactButton>;
};

Button.propTypes = propTypes;

Button.defaultProps = {
  content: '',
  icon: <></>,
  disabled: false,
  isToggle: false,
  isToggled: false,
  isSelected: false,
  height: '',
  width: '',
  style: {},
  id: '',
  hideOnSmall: false,
};

export default Button;
