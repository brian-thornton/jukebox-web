import { FC, useContext, useState } from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Row, Col } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';

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
  actionVisible,
  font,
  background,
  allowToggle = true,
  mobileActions,
  mobileOffset,
}) => {
  const settings = useContext(SettingsContext);
  const { styles } = settings || {};

  const itemStyle = {
    color: styles?.fontColor,
    background: background || styles?.trackBackgroundColor,
    fontFamily: font || styles?.listFont,
  };

  // return (
  //   <ListGroupItem
  //     className={classes.itemStyle}
  //     style={itemStyle}
  //     onClick={(e) => {
  //       if (onClick) {
  //         onClick();
  //       }
  //     }}
  //   >
  //     <Row>
  //       <Col lg={actionVisible ? '6' : '8'} xl={actionVisible ? '6' : '8'} md="6">
  //         <div className={classes.itemText}>
  //           {includeCheckbox && <CheckToggle isChecked={checked} onClick={onCheck} />}
  //           {text}
  //         </div>
  //       </Col>
  //       <Col>
  //         <div className={classes.itemButtons}>
  //           {!settings.isScreenSmall && buttons}
  //         </div>
  //       </Col>
  //     </Row>
  //   </ListGroupItem>
  // );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={classes.itemContainer} style={itemStyle}>
      <div className={classes.itemLeft}>
        {includeCheckbox && <CheckToggle isChecked={checked} onClick={onCheck} />}
        {text}
      </div>
      <div className={classes.buttons}>
        {buttons}
      </div>
      <div className={classes.kebob}>
        <ThreeDotsVertical onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
      {isMenuOpen && (
        <div className={classes.tooltipContainer}>
          <div className={classes.tooltip} style={{top: mobileOffset}} onClick={() => setIsMenuOpen(false)}>
            {mobileActions}
          </div>
        </div>
      )}
    </div >
  )
};

export default Item;
