import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Settings } from './shapes';

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
      variant="outline-light"
      onClick={() => setPin(`${pin}${number}`)}
    >
      {number}
    </Button>
  );

  return (
    <Modal size="sm" show={isOpen} onHide={() => handleClose(pin === settings.pin)}>
      <Modal.Header closeButton className="header">
        <Modal.Title>Enter Pin</Modal.Title>
      </Modal.Header>
      <Modal.Body className="body">
        <Container>
          <Row>
            {numberButton(1)}
            {numberButton(2)}
            {numberButton(3)}
          </Row>
          <Row>
            {numberButton(4)}
            {numberButton(5)}
            {numberButton(6)}
          </Row>
          <Row>
            {numberButton(7)}
            {numberButton(8)}
            {numberButton(9)}
          </Row>
          <Row>
            {numberButton(0)}
            <Button variant="outline-light" className="clear-button" onClick={() => setPin('')}>Clear</Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

PinModal.propTypes = propTypes;

export default PinModal;
