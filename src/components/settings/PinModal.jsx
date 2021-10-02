import React, { useState, useEffect, useContext } from 'react';
import { Container, Row } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import Button from '../Button';
import Modal from '../common/Modal';
import './PinModal.css';
import { SettingsContext } from '../layout/SettingsProvider';

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
    <Button onClick={() => setPin(`${pin}${number}`)} content={number} height="75" width="75" />
  );

  const row = content => content.map(number => numberButton(number));

  return (
    <Modal
      size="sm"
      isFooterHidden
      isOpen={isOpen}
      onCancel={() => handleClose(pin === settings.pin)}
      title="Enter Pin"
      body={(
        <Container>
          <Row>{row([1, 2, 3])}</Row>
          <Row>{row([4, 5, 6])}</Row>
          <Row>{row([7, 8, 9])}</Row>
          <Row>
            {numberButton(0)}
            <Button onClick={() => setPin('')} content="Clear" />
          </Row>
        </Container>
      )}
    />
  );
}

PinModal.propTypes = propTypes;

export default PinModal;
