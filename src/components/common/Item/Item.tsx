import { FC, useContext } from 'react';

import CheckToggle from '../CheckToggle/CheckToggle';
import { SettingsContext } from '../../layout/SettingsProvider';
import classes from './Item.module.css';

interface IItem {
  buttons?: any,
  onClick?: Function,
  text: string,
  includeCheckbox?: boolean,
  onCheck?: Function,
  checked?: false,
  actionVisible?: boolean,
  font?: string,
  allowToggle?: boolean,
  background?: string,
  mobileActions?: any,
  mobileOffset?: string,
}

const Item: FC<IItem> = ({
  buttons,
  onClick,
  text,
  includeCheckbox,
  onCheck,
  checked,
  font,
  background
}) => {
  const settings = useContext(SettingsContext);
  const { styles } = settings || {};

  const itemStyle = {
    color: styles?.fontColor,
    background: background || styles?.trackBackgroundColor,
    fontFamily: font || styles?.listFont,
  };

  return (
    <div className={classes.itemContainer} style={itemStyle} onClick={(e) => {
      if (onClick) {
        onClick();
      }
    }}>
      <div className={classes.itemLeft}>
        {includeCheckbox && <CheckToggle isChecked={checked} onClick={onCheck} />}
        {text}
      </div>
      <div className={classes.buttons}>
        {buttons}
      </div>
    </div >
  )
};

export default Item;
