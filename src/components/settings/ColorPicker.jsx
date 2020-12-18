import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ChromePicker } from 'react-color';

import './PinModal.css';

function ColorPicker({ isOpen, setIsOpen, setColor, allowGradient }) {
  const [colorType, setColorType] = useState('solid');
  const [gradientA, setGradientA] = useState();
  const [gradientB, setGradientB] = useState();
  const [solidColor, setSolidColor] = useState();

  const colorPickers = () => {
    if (allowGradient && colorType === 'gradient') {
      return (
        <React.Fragment>
          <ChromePicker color={gradientA} onChangeComplete={(colorData) => setGradientA(colorData)} />
          <ChromePicker color={gradientB} onChangeComplete={(colorData) => setGradientB(colorData)} />
        </React.Fragment>
      );
    }

    return <ChromePicker color={solidColor} onChangeComplete={(colorData) => setSolidColor(colorData)} />;
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
        <React.Fragment>
          <input style={{ color: '#FFFFFF' }} type="radio" name="colorType" onChange={() => setColorType('solid')} /><div style={{ color: '#FFFFFF' }}>Solid</div>
          <input style={{ color: '#FFFFFF', marginLeft: '10px' }} type="radio" name="colorType" onChange={() => setColorType('gradient')} />Gradient
        </React.Fragment>
      );
    }

    return <React.Fragment />;
  };

  return (
    <Modal size="lg" show={isOpen} onHide={() => setIsOpen(false)}>
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

export default ColorPicker;