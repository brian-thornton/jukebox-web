import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

import { getCurrentState, powerOff, setEffect, setSolidColor, demoEffect } from '../../lib/lighting-client';
import { deleteSkin, createSkin } from '../../lib/style-client';
import Button from '../Button';
import ColorPicker from './skins/ColorPicker';
import ControllerEffects from './ControllerEffects';
import ControllerPalettes from './ControllerPalettes';
import './SegmentColorSelection.scss';
import { SettingsContext } from '../layout/SettingsProvider';

const SegmentColorSelection = ({ skin, controller, segment, event, onSaveComplete }) => {
  const segmentEventConfig = skin.lighting?.controllers?.find((c) => c.ip === controller.ip).segments.find((s) => s.id === segment.id && s.event === event);
  const [controllerState, setControllerState] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [mode, setMode] = useState();
  const [effectSpeed, setEffectSpeed] = useState(100);
  const [effectBrightness, setEffectBrightness] = useState(100);
  const [selectedEffect, setSelectedEffect] = useState(segmentEventConfig?.effect || 'Solid');
  const [selectedPalette, setSelectedPalette] = useState();
  const palletEffects = ['Palette', 'Colorwaves', 'BPM', 'Lake', 'Pacifica', 'Noise Pal', 'Flow', 'Blends', 'Dynamic Smooth'];
  const size = (palletEffects.includes(selectedEffect) || selectedEffect === "Solid") ? "6" : "12"
  const settings = useContext(SettingsContext);

  const loadState = async () => {
    getCurrentState(controller.ip).then(data => setControllerState(data));
  };

  const initState = () => {
    loadState()
  };

  useEffect(initState, []);

  const saveSkin = () => {
    deleteSkin(skin.name).then(() => {
      let { lighting, ...colors } = skin;

      const segmentEvent = {
        id: segment.id,
        event,
        mode,
        effect: selectedEffect ? selectedEffect : '',
        color: selectedColor ? selectedColor : '',
        palette: selectedPalette ? selectedPalette : '',
        start: segment.start,
        stop: segment.stop,
        effectSpeed,
        effectBrightness,
      }

      if (!lighting) {
        lighting = {
          controllers: [{
            ip: controller.ip,
            segments: [segmentEvent]
          }],
        }
      } else {
        const updatedController = lighting.controllers.find((c) => c.ip === controller.ip);
        const updatedSegment = updatedController.segments.find((s) => s.id === segment.id && s.event === event && segment.start.toString() === s.start.toString() && segment.stop.toString() === s.stop.toString());

        if (updatedSegment) {
          updatedSegment.mode = mode;
          updatedSegment.effect = selectedEffect ? selectedEffect : '';
          updatedSegment.color = selectedColor ? selectedColor : '';
          updatedSegment.palette = selectedPalette ? selectedPalette : '';
          updatedSegment.effectSpeed = effectSpeed ? effectSpeed : '';
          updatedSegment.effectBrightness = effectBrightness ? effectBrightness : '';
        } else {
          updatedController.segments.push(segmentEvent)
        }
      }

      createSkin({
        name: skin.name,
        skin: { ...colors, lighting },
      }).then(() => onSaveComplete());
    });
  };

  const onSelectEffect = (effect) => {
    demoEffect(controller.ip, effect, selectedPalette, segment.start, segment.stop, effectSpeed);
    setSelectedEffect(effect);
    setMode('effect');
  };

  const onSelectSpeed = (speed) => {
    const percent = `.${speed}` * 255;
    setEffectSpeed(percent);
    demoEffect(controller.ip, selectedEffect, selectedPalette, segment.start, segment.stop, percent, effectBrightness);
    setMode('effect');
  };

  const onSelectBrightness = (brightness) => {
    const percent = `.${brightness}` * 255;
    setEffectBrightness(percent);
    demoEffect(controller.ip, selectedEffect, selectedPalette, segment.start, segment.stop, effectSpeed, percent);
    setMode('effect');
  };

  const onSelectPalette = (palette) => {
    setSelectedPalette(palette);
    demoEffect(controller.ip, selectedEffect, selectedPalette, segment.start, segment.stop);
    setSelectedEffect(selectedEffect);
    setMode('effect');
  }

  const onSelectColor = (color) => {
    setSolidColor(controller.ip, [color.rgb.r, color.rgb.g, color.rgb.b], segment.start, segment.stop);
    setSelectedColor([color.rgb.r, color.rgb.g, color.rgb.b]);
  }

  return (
    <>
      {controllerState && (
        <Container fluid className="segment-color-container">
          <Row>
            <Form.Label style={{ color: settings.styles.fontColor, paddingTop: '5px', marginLeft: '10px', marginRight: '10px' }}>Effect Speed</Form.Label>
            <Form.Range onChange={(event) => onSelectSpeed(event.target.value)} />
            <Form.Label style={{ color: settings.styles.fontColor, paddingTop: '5px', marginLeft: '50px', marginRight: '10px' }}>Effect Brightness</Form.Label>
            <Form.Range onChange={(event) => onSelectBrightness(event.target.value)} />
          </Row>
          <Row className="segment-effects-row">
            <Col lg={size} md={size}>
              <ControllerEffects
                controllerState={controllerState}
                onSelect={onSelectEffect}
              />
            </Col>
            {palletEffects.includes(selectedEffect) && (
              <Col lg={size} md={size}>
                <ControllerPalettes
                  controllerState={controllerState}
                  onSelect={onSelectPalette}
                />
              </Col>
            )}
            {selectedEffect === "Solid" && (
              <Col lg={size} md={size}>
                <ColorPicker onChange={onSelectColor} solidOnly={true} />
              </Col>
            )}
          </Row>
          <Row>
            <Col lg="12" md="12">
              <Button onClick={() => saveSkin()} content="Save" />
              <Button onClick={() => {
                powerOff(controller.ip);
                setSelectedEffect('Off')
                setSelectedPalette('');
              }} content={`Disable Lights for ${event}`} />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default SegmentColorSelection;