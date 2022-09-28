import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
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
  isSelected,
  height,
  width,
  style,
  id,
  hideOnSmall,
  hideOnLarge,
}) => {
  const settings = useContext(SettingsContext);
  const [isHover, setIsHover] = useState(false);

  const buttonStyle = {
    marginTop: style?.marginTop,
    marginBottom: style?.marginBottom,
    background: style?.buttonBackgroundColor || settings.styles.buttonBackgroundColor,
    fontWeight: settings.styles.buttonFontWeight,
    color: settings.styles.buttonFontColor,
    fontFamily: style?.fontFamily || settings.styles.buttonFont,
    float: 'right',
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

  if (width === "100%") {
    buttonStyle.minWidth = "100%";
    buttonStyle.maxWidth = "100%";
    buttonStyle.overflow = 'hidden';
    buttonStyle.whiteSpace = 'nowrap';
    buttonStyle.textOverflow = 'ellipsis';
  } else if (width) {
    buttonStyle.minWidth = `${width}px`;
    buttonStyle.maxWidth = `${width}px`;
    buttonStyle.overflow = 'hidden';
    buttonStyle.whiteSpace = 'nowrap';
    buttonStyle.textOverflow = 'ellipsis';
  }

  if (height) {
    buttonStyle.minHeight = `${height}px`;
  }

  let dynamicClasses = '';
  if (hideOnSmall) {
    dynamicClasses = `${dynamicClasses} d-none d-sm-block`;
  }

  return <ReactButton onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} id={id} disabled={disabled} style={buttonStyle} className={`button ${dynamicClasses}`} variant="outline-light" onClick={onClick}>{content || icon}</ReactButton>;
}

Button.propTypes = propTypes;

Button.defaultProps = {
  content: '',
  icon: <></>,
  disabled: false,
  isToggle: false,
  isToggled: false,
  height: '',
  width: '',
};

export default Button;
