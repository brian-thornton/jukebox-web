import { FC, useContext } from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Container, Row, Col } from 'react-bootstrap';

import CheckToggle from './CheckToggle';
import ExpandRow from './ExpandRow';
import { SettingsContext } from '../layout/SettingsProvider';
import './Item.scss';

interface IItem {
  buttons: [any],
  onClick: Function,
  text: string,
  includeCheckbox?: boolean,
  onCheck: Function,
  checked: boolean,
  actionVisible: boolean,
  font?: string,
};

const Item: FC<IItem> = ({
  buttons,
  onClick,
  text,
  includeCheckbox,
  onCheck,
  checked,
  actionVisible,
  font,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;

  const itemStyle = {
    color: settings?.styles?.fontColor,
    background: settings?.styles?.trackBackgroundColor,
    fontFamily: font || settings?.styles?.listFont,
  };

  if (isScreenSmall) {
    return <ExpandRow text={text} buttons={buttons} setIsExpanded={() => {}} isExpanded={false} />;
  }

  return (
    <ListGroupItem className="itemStyle" style={itemStyle} onClick={(e) => onClick()}>
      <Container fluid>
        <Row>
          <Col lg={actionVisible ? '6' : '8'} xl={actionVisible ? '6' : '8'} md="6">
            <div className="itemText">
              {includeCheckbox && <CheckToggle isChecked={checked} onClick={onCheck} />}
              {text}
            </div>
          </Col>
          <Col>
            <div className="itemButtons">
              {buttons}
            </div>
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
};

export default Item;
