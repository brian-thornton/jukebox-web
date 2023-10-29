import { FC, useContext } from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Row, Col } from 'react-bootstrap';

import CheckToggle from '../CheckToggle/CheckToggle';
import { SettingsContext } from '../../layout/SettingsProvider';
import './Item.scss';

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
}) => {
  const settings = useContext(SettingsContext);
  const { styles } = settings || {};

  const itemStyle = {
    color: styles?.fontColor,
    background: background || styles?.trackBackgroundColor,
    fontFamily: font || styles?.listFont,
  };

  return (
    <ListGroupItem
      className="itemStyle"
      style={itemStyle}
      onClick={(e) => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <Row>
        <Col lg={actionVisible ? '6' : '8'} xl={actionVisible ? '6' : '8'} md="6">
          <div className="itemText">
            {includeCheckbox && <CheckToggle isChecked={checked} onClick={onCheck} />}
            {text}
          </div>
        </Col>
        <Col>
          <div className="itemButtons">
            {!settings.isScreenSmall && buttons}
          </div>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default Item;
