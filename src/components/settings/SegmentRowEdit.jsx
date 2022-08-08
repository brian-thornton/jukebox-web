import React, { useContext, useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import Button from '../Button';
import Item from '../common/Item';
import NameInput from '../common/NameInput';
import { SettingsContext } from '../layout/SettingsProvider';

const SegmentRowEdit = ({ segment, onSave, controller, skin, event, setSegment, onCancel }) => {
  const [editSegment, setEditSegment] = useState({ id: segment.id, start: segment.start, stop: segment.stop });
  const settings = useContext(SettingsContext);
  const controllerMetadata = settings.controllers?.find((c) => c.ip === controller.info?.ip || controller.ip);
  const segmentMetadata = controllerMetadata?.segments.find((s) => s.start === segment.start.toString() && s.stop === segment.stop.toString());

  useEffect(() => setEditSegment({ ...editSegment, name: segmentMetadata.name }), [])

  
  let effectName;
  if (skin) {
    const skinController = skin.lighting.controllers.find((c) => c.ip === (controller.info?.ip || controller.ip));
    const eventSegments = skinController.segments.filter((s) => s.event === event);
    const skinSegment = eventSegments.find((s) => s.start.toString() === segment.start.toString() && s.stop.toString() === segment.stop.toString())
    effectName = skinSegment?.effect;
  }

  useEffect(() => console.log(editSegment), [editSegment])

  return (
    <Item
      text={(
        <Form>
          <Row>
            <Col>
              <Form.Control placeholder={editSegment.name} onChange={(event) => setEditSegment({ ...editSegment, name: event.target.value })} />
            </Col>
            <Col>
              <Form.Control placeholder={editSegment.start} onChange={(event) => setEditSegment({ ...editSegment, start: event.target.value })} />
            </Col>
            <Col>
              <Form.Control placeholder={editSegment.stop} onChange={(event) => setEditSegment({ ...editSegment, stop: event.target.value })} />
            </Col>
          </Row>
        </Form>
      )}
      buttons={(
        <>
          <Button content="Save" onClick={() => onSave(segment, editSegment)} />
          <Button content="Cancel" onClick={onCancel} />
        </>
      )}
    />
  )
};

export default SegmentRowEdit;