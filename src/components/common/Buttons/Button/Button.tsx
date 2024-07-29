import { Button as ReactButton } from 'react-bootstrap';
import { FC, useContext, useState } from 'react';

import { SettingsContext } from '../../../layout/SettingsProvider';
import { IStyle } from '../../../interface';
import classes from './Button.module.css';

interface IButton {
  onClick?: Function,
  content?: any,
  icon?: any,
  disabled?: boolean,
  isToggle?: boolean,
  isToggled?: boolean,
  isSelected?: boolean,
  height?: string,
  width?: string,
  id?: string,
  style?: IStyle,
  hideOnSmall?: boolean
}

const Button: FC<IButton> = ({
  onClick, content, icon, disabled, isToggle, isToggled, isSelected, height, width, style, id,
  hideOnSmall,
}) => {
  const settings = useContext(SettingsContext);
  console.log(settings)
  const { controlButtonSize } = settings.styles || {};
  const { styles } = settings || {};
  const [isHover, setIsHover] = useState(false);
  const {
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    buttonBackgroundColor,
    fontFamily,
  } = style || {};

  const buttonStyle = {
    marginTop,
    marginBottom,
    background: buttonBackgroundColor || styles?.buttonBackgroundColor,
    fontSize: "var(--font-size)",
    fontWeight: styles?.buttonFontWeight,
    color: styles?.buttonFontColor,
    fontFamily: fontFamily || styles?.buttonFont,
    float: 'right',
    borderRadius: styles?.buttonShape === 'round' ? '35px' : '',
    overflow: '',
    whiteSpace: '',
    textOverflow: '',
    minWidth: '',
    maxWidth: '',
    minHeight: '',
    marginLeft,
    marginRight,
    width: (!controlButtonSize || controlButtonSize === 'small') ? '' : '60px',
    height: (!controlButtonSize || controlButtonSize === 'small') ? '' : '60px',
  };

  if (isSelected) {
    buttonStyle.background = styles?.activeButtonColor;
  }

  if (isHover || (isToggle && isToggled)) {
    buttonStyle.background = styles?.trackBackgroundColor;
  } else if (isToggle && !isToggled) {
    buttonStyle.background = styles?.buttonBackgroundColor;
  }

  buttonStyle.overflow = 'hidden';
  buttonStyle.whiteSpace = 'nowrap';
  buttonStyle.textOverflow = 'ellipsis';

  if (width === '100%') {
    buttonStyle.minWidth = '100%';
    buttonStyle.maxWidth = '100%';
  } else if (width?.includes('%')) {
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

  // @ts-ignore
  return <ReactButton onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} id={id} disabled={disabled} style={buttonStyle} className={`${classes.button} ${dynamicClasses}`} variant="outline-light" onClick={onClick}>{content || icon}</ReactButton>;
};

export default Button;
