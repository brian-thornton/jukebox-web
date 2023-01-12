import React, { useContext, useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import Item from '../common/Item';
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
  onSave: PropTypes.func.isRequired,
  event: Event.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const SegmentRowEdit = ({
  segment,
  onSave,
  controller,
  skin,
  event,
  onCancel,
}) => {
  const [editSegment, setEditSegment] = useState({
    id: segment.id,
    start: segment.start,
    stop: segment.stop,
  });
  const settings = useContext(SettingsContext);
  const controllers = { settings };
  const controllerMetadata = controllers?.find(c => c.ip === controller.info?.ip || controller.ip);
  const { start, stop } = segment;
  const segmentMetadata = controllerMetadata?.segments.find(s => s.start === start.toString()
    && s.stop === stop.toString());

  useEffect(() => setEditSegment({ ...editSegment, name: segmentMetadata.name }), []);

  if (skin) {
    const skinController = skin.lighting.controllers.find(c => (
      c.ip === (controller.info?.ip || controller.ip)));
    const eventSegments = skinController.segments.filter(s => s.event === event);
  }

  return (
    <Item
      text={(
        <Form>
          <Row>
            <Col>
              <Form.Control
                placeholder={editSegment.name}
                onChange={e => setEditSegment({ ...editSegment, name: e.target.value })}
              />
            </Col>
            <Col>
              <Form.Control
                placeholder={editSegment.start}
                onChange={e => setEditSegment({ ...editSegment, start: e.target.value })}
              />
            </Col>
            <Col>
              <Form.Control
                placeholder={editSegment.stop}
                onChange={e => setEditSegment({ ...editSegment, stop: e.target.value })}
              />
            </Col>
          </Row>
        </Form>
      )}
      buttons={(
        <>
          <Button content={<FormattedMessage id="save" />} onClick={() => onSave(segment, editSegment)} />
          <Button content={<FormattedMessage id="cancel" />} onClick={onCancel} />
        </>
      )}
    />
  );
};

SegmentRowEdit.defaultProps = {
  skin: null,
};

SegmentRowEdit.propTypes = propTypes;

export default SegmentRowEdit;
