import React, { useState, useEffect } from 'react';
import { Button, Modal, Container, Row } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Settings } from './shapes';

const propTypes = {
  isOpen: PropTypes.bool,
  settings: Settings.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function PinModal({ isOpen, settings, handleClose }) {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin === settings.pin) {
      handleClose(true);
    }
  }, [pin])

  const numberButton = (number) => {
    const numberButtonStyle = {
      width: '75px',
      height: '75px',
      margin: '5px',
    }

    return (
      <Button
        key={number}
        style={numberButtonStyle}
        variant="outline-light"
        onClick={() => setPin(`${pin}${number}`)}
      >
        {number}
      </Button>
    );
  };

  const headerStyle = { backgroundColor: 'dimGray', color: 'white' };
  const bodyStyle = { backgroundColor: 'dimGray' };
  const footerStyle = { backgroundColor: 'dimGray' };
  const clearButtonStyle = { width: '160px', height: '75px', margin: '5px' };

  return (
    <Modal size="sm" show={isOpen} onHide={() => handleClose(pin === settings.pin)}>
      <Modal.Header closeButton style={headerStyle}>
        <Modal.Title>Enter Pin</Modal.Title>
      </Modal.Header>
      <Modal.Body style={bodyStyle}>
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
            <Button variant="outline-light" style={clearButtonStyle} onClick={() => setPin('')}>Clear</Button>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer style={footerStyle}>
        <Button variant="secondary" onClick={() => handleClose(false)}>Close</Button>
        <Button variant="primary" onClick={() => handleClose(pin === settings.pin)}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

PinModal.propTypes = propTypes;

export default PinModal;
