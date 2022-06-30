import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState, useContext } from 'react';
import { ChromePicker } from 'react-color';
import { PropTypes } from 'prop-types';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './ColorPicker.module.css';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
};

const ColorPicker = ({
  setIsOpen,
  setColor,
}) => {
  const settings = useContext(SettingsContext);
  const [colorType, setColorType] = useState('solid');
  const [gradientA, setGradientA] = useState();
  const [gradientB, setGradientB] = useState();
  const [colorString, setColorString] = useState('transparent');
  const [solidColor, setSolidColor] = useState();

  const picker = (color, width, handler) => (
    <div style={{ width: width, display: 'inline-block' }}>
      <ChromePicker color={color} onChangeComplete={handler} />
    </div>
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

  const transparentCardSkin = {
    color: settings.styles.fontColor,
  }

  return (
    <Card className={styles.transparentCardStyle}>
      <Card.Body>
        <Tabs onSelect={e => setColorType(e)}>
          <Tab eventKey="solid" title="Solid Color">
            <Container fluid>
              <Row>
                <Col lg="3" md="3" sm="3">
                  {picker(solidColor, '50%', colorData => setSolidColor(colorData))}
                </Col>
                <Col lg="6" md="6" sm="6">
                  <div style={{ backgroundColor: colorString, height: '40vh', width: '100%' }}>Example</div>
                </Col>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="gradient" title="Gradient">
            <Container fluid>
              <Row>
                <Col lg="3" md="3" sm="3">
                  {picker(gradientA, '50%', colorData => setGradientA(colorData))}
                </Col>
                <Col lg="3" md="3" sm="3">
                  {picker(gradientB, '50%', colorData => setGradientB(colorData))}
                </Col>
                <Col lg="6" md="6" sm="6">
                  <div style={{ background: colorString, height: '40vh', width: '100%' }}>Example</div>
                </Col>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="transparent" title="Transparent">
            <Card className={styles.transparentCardStyle} style={transparentCardSkin}>
              <Card.Title className={styles.colorPickerTitle}>Transparent</Card.Title>
              <Card.Body>
                <Card.Text className={styles.colorPickerText}>
                  If this tab is selected, the color will be transparent.
                </Card.Text>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
        <Button onClick={() => setIsOpen(false)} content="Cancel" />
        <Button onClick={() => {
          formatColor();
          setIsOpen(false);
        }} content="Save" />
      </Card.Body>
    </Card>
  );
}

ColorPicker.propTypes = propTypes;

export default ColorPicker;
