import React, { useState, useContext } from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
} from 'react-bootstrap';
import { ChromePicker } from 'react-color';
import { PropTypes } from 'prop-types';

import './PinModal.css';

import {
  buttonProps,
  modalBodyStyle,
  modalHeaderStyle,
  modalTitleStyle,
} from '../../lib/styleHelper';
import { SettingsContext } from '../layout/Jukebox';

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
  const settings = useContext(SettingsContext);
  const [colorType, setColorType] = useState('solid');
  const [gradientA, setGradientA] = useState();
  const [gradientB, setGradientB] = useState();
  const [solidColor, setSolidColor] = useState();
  const picker = (color, handler) => <ChromePicker color={color} onChangeComplete={handler} />;

  const colorPickers = () => {
    if (allowGradient && colorType === 'gradient') {
      return (
        <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
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
    if (colorType === 'transparent') {
      setColor('transparent');
    } else if (colorType === 'solid') {
      if (solidColor && solidColor.hex) {
        setColor(solidColor.hex);
      }
    } else if (gradientA && gradientA.rgb && gradientB && gradientB.rgb) {
      const gradientString = `linear-gradient(180deg, rgba(${gradientA.rgb.r},${gradientA.rgb.g},${gradientA.rgb.b},${gradientA.rgb.a}) 0%, rgba(${gradientB.rgb.r},${gradientB.rgb.g},${gradientB.rgb.b},${gradientB.rgb.a}) 100%`;
      setColor(gradientString);
    }

    setIsOpen(false);
  };

  const radioButtons = () => {
    if (allowGradient) {
      return (
        <Container style={{ marginTop: '0px', marginBottom: '0px' }}>
          <Row>
          <input style={{ color: '#FFFFFF', marginTop: '5px' }} type="radio" name="colorType" onChange={() => setColorType('transparent')} />
            <div style={{ color: '#FFFFFF', marginRight: '10px' }}>Transparent</div>
            <input style={{ color: '#FFFFFF', marginTop: '5px' }} type="radio" name="colorType" onChange={() => setColorType('solid')} />
            <div style={{ color: '#FFFFFF', marginRight: '10px' }}>Solid</div>
            <input style={{ color: '#FFFFFF', marginTop: '5px' }} type="radio" name="colorType" onChange={() => setColorType('gradient')} />
            <div style={{ color: '#FFFFFF' }}>Gradient</div>
          </Row>
        </Container>
      );
    }

    return <React.Fragment />;
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)}>
      <Modal.Header closeButton style={modalHeaderStyle(settings)}>
        <Modal.Title style={modalTitleStyle(settings)}>Select Color</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle(settings)}>
        {radioButtons()}
        {colorPickers()}
        <Button {...buttonProps(settings)} onClick={formatColor}>OK</Button>
      </Modal.Body>
    </Modal>
  );
}

ColorPicker.propTypes = propTypes;

ColorPicker.defaultProps = {
  allowGradient: true,
};

export default ColorPicker;
