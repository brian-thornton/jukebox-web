import { FC, useContext } from 'react';

import Button from '../Button/Button';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { IStyle } from '../../../interface';

interface IControlButton {
  disabled?: boolean,
  onClick: Function,
  text: string,
  height?: string,
  width: string,
  isSelected?: boolean,
  style?: IStyle,
}

const ControlButton: FC<IControlButton> = ({
  disabled, height, width = '275', onClick, text, isSelected, style,
}) => {
  const settings = useContext(SettingsContext);
  const { styles } = settings;

  const controlButtonStyle = {
    background: styles?.buttonBackgroundColor,
    color: styles?.fontColor,
    minHeight: height ? `${height}px` : '65px',
    fontFamily: styles?.buttonFont,
    width: width ? width : '100%',
    fontSize: style?.fontSize,
    marginTop: style?.marginTop,
    marginBottom: style?.marginBottom,
  };

  return (
    <Button
      width={width}
      height={height}
      disabled={disabled}
      style={controlButtonStyle}
      onClick={onClick}
      content={text}
      isSelected={isSelected}
    />
  );
};

export default ControlButton;
