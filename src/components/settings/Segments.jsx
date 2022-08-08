import { PlusSquare } from 'react-bootstrap-icons';
import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { v4 as uuidv4 } from 'uuid';

import Button from '../Button';
import Item from '../common/Item';
import { SettingsContext } from '../layout/SettingsProvider';
import AddNew from '../common/AddNew';
import { updateSettings } from '../../lib/settings-client';
import styles from './Segments.module.css';
import { createSegment, removeSegment } from '../../lib/lighting-client';
import SegmentRowEdit from './SegmentRowEdit';
import SegmentRowInfo from './SegmentRowInfo';

const Segments = ({ controller, segments, allowRemove = true, allowAdd = true, onConfigure, skin, event }) => {
  const settings = useContext(SettingsContext);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [segment, setSegment] = useState();
  const [existingSegment, setExistingSegment] = useState();
  const [configureSegment, setConfigureSegment] = useState();

  const isSegmentOnController = (start, stop) => {
    return segments.filter((s) => s.start.toString() === start.toString() && s.stop.toString() === stop.toString()).length >= 1;
  }

  const onUpdateSegment = async (oldData, data) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find((c) => c.ip === controller.info.ip);

    if (!updatedController.segments?.length) {
      // No segments exist for the controller. Add the first one.
      updatedController.segments = [{
        id: uuidv4(),
        start: data.start,
        stop: data.stop,
        name: data.name,
      }];
    } else {
      // Check if we are updating an existing segment.
      const updatedSegment = updatedController.segments.find((s) => s.id === data.id);

      if (updatedSegment) {
        // An existing segment was found. Update it.
        updatedSegment.name = data.name.toString();
        updatedSegment.start = data.start.toString();
        updatedSegment.stop = data.stop.toString();
      } else {
        // The controller exists and has segments but we need to add one.
        updatedController.segments.push({
          id: uuidv4(),
          start: data.start,
          stop: data.stop,
          name: data.name,
        });
      }
    }

    // Check if the segment is on the controller. If it is we need to
    // push out the update.
    if (isSegmentOnController(oldData.start, oldData.stop)) {
      await removeSegment(controller.info.ip, oldData.start, oldData.stop);
      await createSegment(controller.info.ip, data.start, data.stop);
    }

    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const segmentRow = (segment, isOnController) => {
    const segmentInConfigurationMode = configureSegment && segment.id === configureSegment.id && segment.start === configureSegment.start && segment.stop === configureSegment.stop;

    return (
      <>
        {!segmentInConfigurationMode && <SegmentRowInfo isOnController={isOnController} onConfigure={(segment) => {
          setConfigureSegment(segment);

          // If we have an onConfigure function we are configuring skin colors.
          // If not, we are setting up cabinet segments.
          if (onConfigure) {
            onConfigure(segment);
          }
        }} event={event} segment={segment} skin={skin} controller={controller} />}
        {segmentInConfigurationMode && !skin && (<SegmentRowEdit onSave={onUpdateSegment} onCancel={() => setConfigureSegment(null)} setSegment={setSegment} event={event} segment={segment} skin={skin} controller={controller} />)}
      </>
    )
  }

  const onAddSegment = (fields) => {
    onUpdateSegment(fields);
  }

  return (
    <>
      {isAddOpen && (
        <AddNew
          title="Add a new Lighting Segment"
          onConfirm={(fields) => {
            onAddSegment(fields);
          }}
          onCancel={() => setIsAddOpen(false)}
          fields={{ name: 'Name', start: 'Starting LED Position', stop: 'Ending LED Position' }}
        />
      )}
      {!isAddOpen && (
        <Container fluid className={styles.styleEditorContent}>
          {allowAdd && (
            <Row>
              <Button
                onClick={() => {
                  setIsAddOpen(true);
                }}
                icon={<PlusSquare />}
              />
            </Row>
          )}
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>
                <ListGroup className={styles.styleEditorContent}>
                  {settings.controllers?.find((c) => c.ip === (controller.info?.ip || controller.ip)).segments.map((s) => segmentRow(s, isSegmentOnController(s.start, s.stop)))}
                  {segments?.map((segment) => {
                    if (!settings.controllers?.find((c) => c.ip === (controller.info?.ip || controller.ip)).segments.find((s) => s.start.toString() === segment.start.toString() && s.stop.toString() === segment.stop.toString())) {
                      segmentRow(segment, true);
                    }
                  })}
                </ListGroup>
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Segments;