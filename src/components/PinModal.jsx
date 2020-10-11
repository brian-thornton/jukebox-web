import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Album as albumShape, Settings } from './shapes';

const propTypes = {
  album: albumShape.isRequired,
  cover: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
  coverArtOnly: PropTypes.bool,
};

function PinModal({isOpen}) {
  const [pin, setPin] = useState('');

  const numberButton = (number) => (
    <Button key={number} style={{ margin: '5px' }} variant="outline-light" onClick={() => setPin(`${pin}${number}`)}>{number}</Button>
  );

  const handleClose = () => {

  };

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Pin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {numberButton(1)}
        {numberButton(2)}
        {numberButton(3)}
        {numberButton(4)}
        {numberButton(5)}
        {numberButton(6)}
        {numberButton(7)}
        {numberButton(8)}
        {numberButton(9)}
        {numberButton(0)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={() => handleClose(pin)}>
          OK
    </Button>
      </Modal.Footer>
    </Modal>
  );
}

PinModal.propTypes = propTypes;

export default PinModal;
