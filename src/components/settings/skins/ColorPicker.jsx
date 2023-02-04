import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState, useContext } from 'react';
import { ChromePicker } from 'react-color';
import { PropTypes } from 'prop-types';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import './ColorPicker.scss';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
  solidOnly: PropTypes.bool,
};

const ColorPicker = ({
  setIsOpen,
  setColor,
  onChange,
  solidOnly,
}) => {
  const settings = useContext(SettingsContext);
  const [opacity, setOpacity] = useState(4);
  const [colorType, setColorType] = useState('solid');
  const [gradientA, setGradientA] = useState();
  const [gradientB, setGradientB] = useState();
  const [colorString, setColorString] = useState('transparent');
  const [solidColor, setSolidColor] = useState();

  const picker = (color, width, handler) => (
    <div style={{ width, display: 'inline-block' }}>
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
      const gradientString = `linear-gradient(180deg, rgba(${gradientA.rgb.r},${gradientA.rgb.g},${gradientA.rgb.b}, .${opacity}) 0%, rgba(${gradientB.rgb.r},${gradientB.rgb.g},${gradientB.rgb.b}, .${opacity}) 100%`;
      setColor(gradientString);
      setColorString(gradientString);
    }
  };

  useEffect(formatColor, [gradientA, gradientB, opacity]);

  const transparentCardSkin = {
    color: settings.styles.fontColor,
  };

  const formLabelStyle = {
    color: settings.styles.fontColor,
  };

  return (
    <>
      {!solidOnly && (
        <Card className="transparentCardStyle">
          <Card.Body>
            <Tabs onSelect={e => setColorType(e)}>
              <Tab eventKey="solid" title="Solid Color">
                <Container fluid>
                  <Row>
                    <Col lg="3" md="3" sm="3">
                      {picker(solidColor, '50%', colorData => setSolidColor(colorData))}
                    </Col>
                    <Col lg="6" md="6" sm="6">
                      <div style={{ backgroundColor: colorString, height: '40vh', width: '100%' }}><FormattedMessage id="example" /></div>
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
                      <div style={{ background: colorString, height: '40vh', width: '100%' }}><FormattedMessage id="example" /></div>
                    </Col>
                  </Row>
                  <Row>
                    <Form.Label className="formLabel" style={formLabelStyle}>
                      <FormattedMessage id="opacity" />
                    </Form.Label>
                    <Form.Range onChange={e => setOpacity(e.target.value)} />
                  </Row>
                </Container>
              </Tab>
              <Tab eventKey="transparent" title="Transparent">
                <Card className="transparentCardStyle" style={transparentCardSkin}>
                  <Card.Title className="colorPickerTitle"><FormattedMessage id="transparent_title" /></Card.Title>
                  <Card.Body>
                    <Card.Text className="colorPickerText">
                      <FormattedMessage id="transparent_text" />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
            <Button
              onClick={() => setIsOpen(false)}
              content={<FormattedMessage id="cancel" />}
            />
            <Button
              onClick={() => {
                formatColor();
                setIsOpen(false);
              }}
              content={<FormattedMessage id="save" />}
            />
          </Card.Body>
        </Card>
      )}
      {solidOnly && picker(solidColor, '100%', colorData => setSolidColor(colorData))}
    </>
  );
};

ColorPicker.defaultProps = {
  solidOnly: false,
};

ColorPicker.propTypes = propTypes;

export default ColorPicker;
