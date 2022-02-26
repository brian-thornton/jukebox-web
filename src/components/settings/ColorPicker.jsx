import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { ChromePicker } from 'react-color';
import { PropTypes } from 'prop-types';

import { SettingsContext } from '../layout/SettingsProvider';
import Modal from '../common/Modal';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
};

function ColorPicker({
  isOpen,
  setIsOpen,
  setColor,
}) {
  const settings = useContext(SettingsContext);
  const [colorType, setColorType] = useState('solid');
  const [gradientA, setGradientA] = useState();
  const [gradientB, setGradientB] = useState();
  const [colorString, setColorString] = useState('transparent');
  const [solidColor, setSolidColor] = useState();

  const picker = (color, width, handler) => (
    <ChromePicker width={width} color={color} onChangeComplete={handler} />
  );

  const formatColor = () => {
    if (colorType === 'transparent') {
      setColor('transparent');
      setColorString('transparent');
    } else if (colorType === 'solid') {
      if (solidColor && solidColor.hex) {
        setColor(solidColor.hex);
        setColorString(solidColor.hex);
      }
    } else if (gradientA && gradientA.rgb && gradientB && gradientB.rgb) {
      const gradientString = `linear-gradient(180deg, rgba(${gradientA.rgb.r},${gradientA.rgb.g},${gradientA.rgb.b},${gradientA.rgb.a}) 0%, rgba(${gradientB.rgb.r},${gradientB.rgb.g},${gradientB.rgb.b},${gradientB.rgb.a}) 100%`;
      setColor(gradientString);
      setColorString(gradientString);
    }
  };

  useEffect(formatColor, [gradientA]);
  useEffect(formatColor, [gradientB]);

  const transparentCardStyle = {
    background: 'transparent',
    minHeight: '200px',
    height: '100%',
    borderColor: 'black',
    color: settings.styles.fontColor,
    swidth: '18rem',
  };

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onCancel={() => setIsOpen(false)}
      onConfirm={() => {
        formatColor();
        setIsOpen(false);
      }}
      title="Select Color"
      body={(
        <Tabs onSelect={e => setColorType(e)}>
          <Tab eventKey="solid" title="Solid Color">
            {picker(solidColor, '100%', colorData => setSolidColor(colorData))}
          </Tab>
          <Tab eventKey="gradient" title="Gradient">
            <Container>
              <Row>
                <Col lg="4" md="4" sm="4">
                  {picker(gradientA, '100%', colorData => setGradientA(colorData))}
                </Col>
                <Col lg="4" md="4" sm="4">
                  {picker(gradientB, '100%', colorData => setGradientB(colorData))}
                </Col>
                <Col lg="4" md="4" sm="4">
                  <Button style={{ background: colorString }}>Example</Button>
                </Col>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="transparent" title="Transparent">
            <Card style={transparentCardStyle}>
              <Card.Title style={{ textAlign: 'center' }}>Transparent</Card.Title>
              <Card.Body>
                <Card.Text style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  If this tab is selected, the color will be transparent.
                </Card.Text>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
    />
  );
}

ColorPicker.propTypes = propTypes;

export default ColorPicker;
