import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../Button';
import Item from '../common/Item';
import LightingControllers from './LightingControllers';
import { powerOff, powerOn, setEffect } from '../../lib/lighting-client';
import styles from './SkinSegmentConfiguration.module.css';
import SkinSegmentDetail from './SkinSegmentDetail';

const SkinSegmentConfiguration = ({ skin, controller }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();

  const eventRow = (event) => {
    return (
      <Item
        text={event}
        buttons={(
          <>
            <Button
              style={{ float: 'right', width: '100px' }}
              onClick={() => {
                setSelectedEvent(event);
                setIsDetailOpen(true);
              }}
              content="Configure"
            />
          </>
        )}
      />
    );
  }

  return (
    <>
      {!isDetailOpen && (
        <Container fluid className={styles.styleEditorContent}>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>
                <ListGroup className={styles.styleEditorContent}>
                  {eventRow('Albums')}
                  {eventRow('Category')}
                  {eventRow('Tracks')}
                  {eventRow('Playlists')}
                  {eventRow('Queue')}
                  {eventRow('Settings')}
                  {eventRow('Delete')}
                  {eventRow('Enqueue')}
                  {eventRow('Search')}
                  {eventRow('Lock')}
                </ListGroup>
              </Row>
            </Col>
          </Row>
          <Row>
            <Button
              style={{ float: 'right', width: '100px' }}
              onClick={() => {
                setSelectedEvent(null);
                setIsDetailOpen(false);
              }}
              content="Done"
            />
          </Row>
        </Container>
      )}
      {isDetailOpen && (
        <SkinSegmentDetail skin={skin} event={selectedEvent} controller={controller} onCancel={() => setIsDetailOpen(false)} />
      )}
    </>
  );
};

export default SkinSegmentConfiguration;