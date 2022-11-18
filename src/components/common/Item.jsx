import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Accordion, Container, Row, Col } from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import CheckToggle from '../common/CheckToggle';
import { SettingsContext } from '../layout/SettingsProvider';
import './Item.scss';

const propTypes = {
  buttons: PropTypes.node,
  onClick: PropTypes.func,
  text: PropTypes.string,
};

const Item = ({ buttons, onClick, text, includeCheckbox, onCheck, checked, actionVisible }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;


  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log('totally custom!'),
    );

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: settings.styles.listFont,
  };

    return (
      <button
        className="accordionHeader" style={itemStyle}
        type="button"
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: settings.styles.listFont,
  };

  const smallRow = () => (
    <Accordion>
      <CustomToggle eventKey="0">{text}</CustomToggle>
      <Accordion.Collapse eventKey="0">
        {buttons}
      </Accordion.Collapse>
    </Accordion>
  );

  if (isScreenSmall) {
    return smallRow();
  }

  return (
    <ListGroupItem className="itemStyle" style={itemStyle} onClick={onClick}>
      <Container fluid>
        <Row>
          <Col lg={actionVisible ? "6" : "8"} xl={actionVisible ? "6" : "8"} md="6">
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
}

Item.defaultProps = {
  buttons: null,
  onClick: null,
  text: '',
};


Item.propTypes = propTypes;

export default Item;
