import { PlusSquare } from 'react-bootstrap-icons';
import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

import Button from '../Button';
import ControllerDetail from './ControllerDetail';
import Item from '../common/Item';
import { SettingsContext } from '../layout/SettingsProvider';
import AddNew from '../common/AddNew';
import { updateSettings } from '../../lib/settings-client';
import styles from './Segments.module.css';
import NameInput from '../common/NameInput';
import { createSegment, removeSegment } from '../../lib/lighting-client';

const Segments = ({ controller, segments, allowRemove = true, allowAdd = true, onConfigure, skin, event }) => {
  const settings = useContext(SettingsContext);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [selectedController, setSelectedController] = useState();
  const [segmentName, setSegmentName] = useState();
  const [configureSegment, setConfigureSegment] = useState();

  const onSetName = async (segment) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find((c) => c.ip === controller.info.ip);

    if (!updatedController.segments?.length) {
      updatedController.segments = [{
        start: segment.start,
        stop: segment.stop,
        name: segment.name,
      }];
    } else {
      const updatedSegment = updatedController.segments.find((s) => s.start.toString() === segment.start.toString() && s.stop.toString() === segment.stop.toString());
      updatedSegment.name = segmentName;
    }

    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const onRemoveSegment = async (segment) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find((c) => c.ip === controller.info.ip);
    updatedController.segments = updatedController.segments.filter((s) => s.start !== segment.start && s.stop !== segment.stop);

    await removeSegment(controller.info.ip, segment.start, segment.stop);

    updateSettings(deepClone).then(() => {
      // window.location.reload();
    });
  };

  const segmentRow = (segment) => {
    const controllerMetadata = settings.controllers?.find((c) => c.ip === controller.info?.ip || controller.ip);
    const segmentMetadata = controllerMetadata?.segments.find((s) => s.start === segment.start.toString() && s.stop === segment.stop.toString());
    const segmentInConfigurationMode = configureSegment && segment.id === configureSegment.id && segment.start === configureSegment.start && segment.stop === configureSegment.stop;

    let effectName;
    if (skin) {
      const skinController = skin.lighting.controllers.find((c) => c.ip === (controller.info?.ip || controller.ip));
      const eventSegments = skinController.segments.filter((s) => s.event === event);
      console.log(eventSegments);
      const skinSegment = eventSegments.find((s) => s.start.toString() === segment.start.toString() && s.stop.toString() === segment.stop.toString())
      effectName = skinSegment.effect;
    }

    return (
      <Item
        text={
          <>
            {!segmentInConfigurationMode && (
              <>
                {`name: ${segmentMetadata?.name} id: ${segment.id} - Start: ${segment.start} Stop: ${segment.stop} effect: ${effectName}`}
              </>
            )}
            {segmentInConfigurationMode && (
              <Container>
                <Row>
                  <Col>
                    <NameInput placeholder="Name" defaultValue={segmentMetadata?.name} onChange={(event) => setSegmentName(event.target.value)} />
                  </Col>
                  <Col>
                    <NameInput placeholder="Start" defaultValue={segmentMetadata?.start || segment.start} onChange={(event) => setSegmentName(event.target.value)} />
                  </Col>
                  <Col>
                    <NameInput placeholder="Stop" defaultValue={segmentMetadata?.stop || segment.stop} onChange={(event) => setSegmentName(event.target.value)} />
                  </Col>
                </Row>
              </Container>
            )}
          </>
        }
        buttons={(
          <>
            {allowRemove && (
              <Button
                style={{ float: 'right', width: '100px' }}
                onClick={() => onRemoveSegment(segment)}
                content="Remove"
              />
            )}
            {!segmentInConfigurationMode && (
              <Button
                style={{ float: 'right', width: '100px' }}
                onClick={() => {
                  setConfigureSegment(segment);

                  if (onConfigure) {
                    onConfigure(segment);
                  }
                }}
                content="Configure"
              />
            )}
            {segmentInConfigurationMode && (
              <>
                <Button
                  style={{ float: 'right', width: '100px' }}
                  onClick={() => {
                    onSetName(segment);
                  }}
                  content="Save"
                />
                <Button
                  style={{ float: 'right', width: '100px' }}
                  onClick={() => {
                    setConfigureSegment(null);
                  }}
                  content="Cancel"
                />
              </>
            )}
          </>
        )}
      />
    );
  }

  const onAddSegment = (fields) => {
    onSetName(fields);
    createSegment(controller.info.ip, fields.start, fields.stop);
  }

  return (
    <>
      {isAddOpen && <AddNew title="Add a new Lighting Segment" onConfirm={(fields) => {
         onAddSegment(fields);
      }} onCancel={() => setIsAddOpen(false)} fields={{ name: 'Name', start: 'Starting LED Position', stop: 'Ending LED Position' }} />}
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
                  {segments?.map((segment) => segmentRow(segment))}
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