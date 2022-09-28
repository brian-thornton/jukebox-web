import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import PreferenceTextRow from './PreferenceTextRow';
import PreferenceToggleRow from './PreferenceToggleRow';

const Preferences = () => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;

  return (
    <Container fluid>
      <Row>
        <Col lg="12" md="12">
          <ListGroup>
            <PreferenceTextRow rowName="name" value={preferences.name} />
            <PreferenceToggleRow name="showAlbumName" value={preferences.showAlbumName} />
            <PreferenceToggleRow name="showAlbumsWithoutCoverArt" value={preferences.showAlbumsWithoutCoverArt} />
            <PreferenceToggleRow name="pinEnabled" value={preferences.pinEnabled} />
            <PreferenceTextRow rowName="pin" value={preferences.pin} />
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => window.location.reload()} content="Save" />
        </Col>
      </Row>
    </Container>
  );
};

export default Preferences;
