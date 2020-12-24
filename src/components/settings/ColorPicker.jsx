import React, { useState } from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
} from 'react-bootstrap';
import { ChromePicker } from 'react-color';
import { PropTypes } from 'prop-types';

import './PinModal.css';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
  allowGradient: PropTypes.bool,
};

function ColorPicker({
  isOpen,
  setIsOpen,
  setColor,
  allowGradient,
}) {
  const [colorType, setColorType] = useState('solid');
  const [gradientA, setGradientA] = useState();
  const [gradientB, setGradientB] = useState();
  const [solidColor, setSolidColor] = useState();
  const picker = (color, handler) => <ChromePicker color={color} onChangeComplete={handler} />;

  const colorPickers = () => {
    if (allowGradient && colorType === 'gradient') {
      return (
        <Container>
          <Row>
            {picker(gradientA, colorData => setGradientA(colorData))}
            {picker(gradientB, colorData => setGradientB(colorData))}
          </Row>
        </Container>
      );
    }

    return picker(solidColor, colorData => setSolidColor(colorData));
  };

  const formatColor = () => {
    if (colorType === 'solid') {
      setColor(solidColor.hex);
    } else {
      const gradientString = `linear-gradient(180deg, rgba(${gradientA.rgb.r},${gradientA.rgb.g},${gradientA.rgb.b},${gradientA.rgb.a}) 0%, rgba(${gradientB.rgb.r},${gradientB.rgb.g},${gradientB.rgb.b},${gradientB.rgb.a}) 100%`;
      setColor(gradientString);
    }

    setIsOpen(false);
  };

  const radioButtons = () => {
    if (allowGradient) {
      return (
        <Container>
          <Row>
            <input style={{ color: '#FFFFFF' }} type="radio" name="colorType" onChange={() => setColorType('solid')} />
            <div style={{ color: '#FFFFFF' }}>Solid</div>
            <input style={{ color: '#FFFFFF', marginLeft: '10px' }} type="radio" name="colorType" onChange={() => setColorType('gradient')} />
            Gradient
          </Row>
        </Container>
      );
    }

    return <React.Fragment />;
  };

  return (
    <Modal size="md" show={isOpen} onHide={() => setIsOpen(false)}>
      <Modal.Header closeButton className="header">
        <Modal.Title>Select Color</Modal.Title>
      </Modal.Header>
      <Modal.Body className="body">
        {radioButtons()}
        {colorPickers()}
        <Button onClick={formatColor}>OK</Button>
      </Modal.Body>
    </Modal>
  );
}

ColorPicker.propTypes = propTypes;

ColorPicker.defaultProps = {
  allowGradient: true,
};

export default ColorPicker;
