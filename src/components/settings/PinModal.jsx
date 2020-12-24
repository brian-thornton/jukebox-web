import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Settings } from '../shapes';

import './PinModal.css';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  settings: Settings.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function PinModal({ isOpen, settings, handleClose }) {
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
      style={{ background: settings.styles.buttonBackgroundColor }}
      variant="outline-light"
      onClick={() => setPin(`${pin}${number}`)}
    >
      {number}
    </Button>
  );

  const row = content => content.map(number => numberButton(number));

  return (
    <Modal size="sm" show={isOpen} onHide={() => handleClose(pin === settings.pin)}>
      <Modal.Header style={{ background: settings.styles.headerColor }} closeButton className="header">
        <Modal.Title>Enter Pin</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: settings.styles.popupBackgroundColor }} className="body">
        <Container>
          <Row>{row([1, 2, 3])}</Row>
          <Row>{row([4, 5, 6])}</Row>
          <Row>{row([7, 8, 9])}</Row>
          <Row>
            {numberButton(0)}
            <Button variant="outline-light" style={{ background: settings.styles.buttonBackgroundColor }} className="clear-button" onClick={() => setPin('')}>Clear</Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

PinModal.propTypes = propTypes;

export default PinModal;
