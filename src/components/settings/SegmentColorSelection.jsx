import React, { useEffect, useState } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';

import { getCurrentState, powerOff, setEffect, setSolidColor } from '../../lib/lighting-client';
import { deleteSkin, createSkin } from '../../lib/style-client';
import Button from '../Button';
import ColorPicker from './ColorPicker';
import Item from '../common/Item';
import Paginator from '../common/Paginator';

const SegmentColorSelection = ({ skin, controller, segment, event, onSaveComplete }) => {
  const segmentEventConfig = skin.lighting?.controllers?.find((c) => c.ip === controller.ip).segments.find((s) => s.id === segment.id && s.event === event);
  const [selectedEffectPage, setSelectedEffectPage] = useState(1);
  const [selectedPalettePage, setSelectedPalettePage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [controllerState, setControllerState] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [mode, setMode] = useState();
  const [selectedEffect, setSelectedEffect] = useState(segmentEventConfig?.effect || 'Solid');
  const [selectedPalette, setSelectedPalette] = useState();
  const palletEffects = ['Palette', 'Colorwaves', 'BPM', 'Lake', 'Pacifica', 'Noise Pal', 'Flow', 'Blends', 'Dynamic Smooth'];
  const effectStart = selectedEffectPage === 1 ? 0 : ((selectedEffectPage * realPageSize) - realPageSize);
  const paletteStart = selectedPalettePage === 1 ? 0 : ((selectedPalettePage * realPageSize) - realPageSize);

  const loadState = async () => {
    getCurrentState(controller.ip).then(data => setControllerState(data));
  };

  const initState = () => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
    loadState()
  };

  useEffect(initState, []);

  const onSelectColor = (color) => {
    setSolidColor(controller.ip, [color.rgb.r, color.rgb.g, color.rgb.b], segment.start, segment.stop);
    setSelectedColor([color.rgb.r, color.rgb.g, color.rgb.b]);
  }

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

  const size = (palletEffects.includes(selectedEffect) || selectedEffect === "Solid") ? "6" : "12"

  return (
    <>
      <Container fluid style={{ width: '100%' }}>
        <Row style={{ alignItems: 'left', display: 'flex', justifyContent: 'left' }}>
          <Col lg={size} md={size}>
            <>
              <ListGroup>
                {controllerState?.effects.slice(effectStart, (effectStart + realPageSize)).map((effect) => {
                  const effectType = palletEffects.includes(effect) ? '(Effect with Palette)' : '(Effect)';

                  return (
                    <Item
                      text={`${effect} ${effectType}`}
                      onClick={() => {
                        setEffect(controller.ip, effect, selectedPalette, segment.start, segment.stop);
                        setSelectedEffect(effect);
                        setMode('effect');
                      }} />
                  )
                })}
              </ListGroup>
              <Paginator
                disableRandom
                onPageChange={(page) => setSelectedEffectPage(page)}
                selectedPage={selectedEffectPage}
                totalItems={controllerState?.effects.length}
                pageSize={realPageSize}
              />
            </>
          </Col>
          {palletEffects.includes(selectedEffect) && (
            <Col lg={size} md={size}>
              <ListGroup>
                {controllerState?.palettes.slice(paletteStart, (paletteStart + realPageSize)).map((palette) => (
                  <Item
                    text={`${palette} (Color Palette)`}
                    onClick={() => {
                      setSelectedPalette(palette);
                      setEffect(controller.ip, selectedEffect, selectedPalette, segment.start, segment.stop);
                      setSelectedEffect(selectedEffect);
                      setMode('effect');
                    }}
                  />
                ))}
              </ListGroup>
              <Paginator
                disableRandom
                onPageChange={(page) => setSelectedPalettePage(page)}
                selectedPage={selectedPalettePage}
                totalItems={controllerState?.palettes.length}
                pageSize={realPageSize}
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
    </>
  );
}

export default SegmentColorSelection;