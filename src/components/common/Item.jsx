import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Container, Row, Col } from 'react-bootstrap';

import CheckToggle from './CheckToggle';
import ExpandRow from './ExpandRow';
import { SettingsContext } from '../layout/SettingsProvider';
import './Item.scss';

const propTypes = {
  buttons: PropTypes.node,
  onClick: PropTypes.func,
  text: PropTypes.string,
  includeCheckbox: PropTypes.bool,
  onCheck: PropTypes.func,
  checked: PropTypes.bool,
  actionVisible: PropTypes.bool,
  font: PropTypes.string,
};

const Item = ({
  buttons, onClick, text, includeCheckbox, onCheck, checked, actionVisible, font,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: font || settings.styles.listFont,
  };

  if (isScreenSmall) {
    return <ExpandRow text={text} buttons={buttons} />;
  }

  return (
    <ListGroupItem className="itemStyle" style={itemStyle} onClick={onClick}>
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

Item.defaultProps = {
  buttons: null,
  onClick: null,
  text: '',
  includeCheckbox: false,
  onCheck: null,
  checked: false,
  actionVisible: false,
  font: '',
};


Item.propTypes = propTypes;

export default Item;
