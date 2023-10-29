import React, { useContext, useEffect, useState } from 'react';
import {
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  getCurrentState,
  powerOff,
  setSolidColor,
  demoEffect,
} from '../../lib/service-clients/lighting-client';
import { deleteSkin, createSkin } from '../../lib/service-clients/style-client';
import Button from '../Button';
import ColorPicker from './skins/ColorPicker/ColorPicker';
import ControllerEffects from './ControllerEffects';
import ControllerPalettes from './ControllerPalettes';
import './SegmentColorSelection.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import {
  Event,
  LightingController,
  Segment,
  Skin,
} from '../shapes';

const propTypes = {
  controller: LightingController.isRequired,
  segment: Segment.isRequired,
  skin: Skin,
  event: Event.isRequired,
  onSaveComplete: PropTypes.func.isRequired,
};

const SegmentColorSelection = ({
  skin,
  controller,
  segment,
  event,
  onSaveComplete,
}) => {
  const segmentEventConfig = skin.lighting?.controllers?.find(c => c.ip === controller.ip).segments.find(s => s.id === segment.id
    && s.event === event);
  const [controllerState, setControllerState] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [mode, setMode] = useState();
  const [effectSpeed, setEffectSpeed] = useState(100);
  const [effectBrightness, setEffectBrightness] = useState(100);
  const [selectedEffect, setSelectedEffect] = useState(segmentEventConfig?.effect || 'Solid');
  const [selectedPalette, setSelectedPalette] = useState();
  const palletEffects = ['Palette', 'Colorwaves', 'BPM', 'Lake', 'Pacifica', 'Noise Pal', 'Flow', 'Blends', 'Dynamic Smooth'];
  const size = (palletEffects.includes(selectedEffect) || selectedEffect === 'Solid') ? '6' : '12';
  const settings = useContext(SettingsContext);

  const loadState = async () => {
    getCurrentState(controller.ip).then(data => setControllerState(data));
  };

  const initState = () => {
    loadState();
  };

  useEffect(initState, []);

  const saveSkin = () => {
    deleteSkin(skin.name).then(() => {
      const { lighting, ...colors } = skin;

      const segmentEvent = {
        id: segment.id,
        event,
        mode,
        effect: selectedEffect || '',
        color: selectedColor || '',
        palette: selectedPalette || '',
        start: segment.start,
        stop: segment.stop,
        effectSpeed,
        effectBrightness,
      };

      if (!lighting) {
        lighting = {
          controllers: [{
            ip: controller.ip,
            segments: [segmentEvent],
          }],
        };
      } else {
        const updatedController = lighting.controllers.find(c => c.ip === controller.ip);
        const updatedSegment = updatedController.segments.find(s => s.id === segment.id
          && s.event === event && segment.start.toString() === s.start.toString()
          && segment.stop.toString() === s.stop.toString());

        if (updatedSegment) {
          updatedSegment.mode = mode;
          updatedSegment.effect = selectedEffect || '';
          updatedSegment.color = selectedColor || '';
          updatedSegment.palette = selectedPalette || '';
          updatedSegment.effectSpeed = effectSpeed || '';
          updatedSegment.effectBrightness = effectBrightness || '';
        } else {
          updatedController.segments.push(segmentEvent);
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
    demoEffect(controller.ip, selectedEffect, selectedPalette, segment.start, segment.stop,
      percent, effectBrightness);
    setMode('effect');
  };

  const onSelectBrightness = (brightness) => {
    const percent = `.${brightness}` * 255;
    setEffectBrightness(percent);
    demoEffect(controller.ip, selectedEffect, selectedPalette, segment.start, segment.stop,
      effectSpeed, percent);
    setMode('effect');
  };

  const onSelectPalette = (palette) => {
    setSelectedPalette(palette);
    demoEffect(controller.ip, selectedEffect, selectedPalette, segment.start, segment.stop);
    setSelectedEffect(selectedEffect);
    setMode('effect');
  };

  const onSelectColor = (color) => {
    setSolidColor(controller.ip, [color.rgb.r, color.rgb.g, color.rgb.b],
      segment.start, segment.stop);
    setSelectedColor([color.rgb.r, color.rgb.g, color.rgb.b]);
  };

  const formLabelStyle = {
    color: settings.styles.fontColor,
    paddingTop: '5px',
    marginLeft: '10px',
    marginRight: '10px',
  };

  return (
    <>
      {controllerState && (
        <Container fluid className="segment-color-container">
          <Row>
            <Form.Label style={formLabelStyle}>
              <FormattedMessage id="effect_speed" />
            </Form.Label>
            <Form.Range onChange={e => onSelectSpeed(e.target.value)} />
            <Form.Label style={formLabelStyle}>
              <FormattedMessage id="effect_brightness" />
            </Form.Label>
            <Form.Range onChange={e => onSelectBrightness(e.target.value)} />
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
            {selectedEffect === 'Solid' && (
              <Col lg={size} md={size}>
                <ColorPicker onChange={onSelectColor} solidOnly={true} />
              </Col>
            )}
          </Row>
          <Row>
            <Col lg="12" md="12">
              <Button
                onClick={() => saveSkin()}
                content={<FormattedMessage id="save" />}
              />
              <Button
                onClick={() => {
                  powerOff(controller.ip);
                  setSelectedEffect('Off');
                  setSelectedPalette('');
                }}
                content={<FormattedMessage id="disable_lights_for" values={{ event }} />}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

SegmentColorSelection.defaultProps = {
  skin: null,
};

SegmentColorSelection.propTypes = propTypes;

export default SegmentColorSelection;
