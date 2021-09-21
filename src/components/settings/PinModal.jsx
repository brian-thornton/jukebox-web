import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import './PinModal.css';
import { SettingsContext } from '../layout/Jukebox';

import {
  buttonProps,
  modalBodyStyle,
  modalHeaderStyle,
  modalTitleStyle,
} from '../../lib/styleHelper';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function PinModal({ isOpen, handleClose }) {
  const settings = useContext(SettingsContext);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin === settings.pin) {
      handleClose(true);
    }
  }, [pin]);

  const numberButton = number => (
    <Button
      key={number}
      className="number-button"
      style={{
        color: settings.styles.fontColor,
        background: settings.styles.buttonBackgroundColor,
        fontFamily: settings.styles.buttonFont,
      }}
      variant="outline-light"
      onClick={() => setPin(`${pin}${number}`)}
    >
      {number}
    </Button>
  );

  const row = content => content.map(number => numberButton(number));

  return (
    <Modal size="sm" show={isOpen} onHide={() => handleClose(pin === settings.pin)}>
      <Modal.Header style={modalHeaderStyle(settings)} closeButton className="header">
        <Modal.Title style={modalTitleStyle(settings)}>Enter Pin</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle(settings)} className="body">
        <Container>
          <Row>{row([1, 2, 3])}</Row>
          <Row>{row([4, 5, 6])}</Row>
          <Row>{row([7, 8, 9])}</Row>
          <Row>
            {numberButton(0)}
            <Button {...buttonProps(settings)} className="clear-button" onClick={() => setPin('')}>Clear</Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

PinModal.propTypes = propTypes;

export default PinModal;
