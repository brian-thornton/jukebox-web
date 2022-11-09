import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import PreferenceRadioRow from './PreferenceRadioRow';
import PreferenceTextRow from './PreferenceTextRow';
import PreferenceToggleRow from './PreferenceToggleRow';

const Preferences = () => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;

  const startsWithFilterOptions = [
    {display: 'None', value: 'none'},
    {display: 'Left', value: 'left'},
    {display: 'Right', value: 'right'},
  ];

  const albumCoverSize = [
    {display: 'Small', value: 'small'},
    {display: 'Medium', value: 'medium'},
    {display: 'Large', value: 'large'},
  ]

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
            <PreferenceRadioRow rowName="Starts with Filter" preferenceName="startsWithLocation" options={startsWithFilterOptions} />
            <PreferenceRadioRow rowName="Album Size" preferenceName="coverSize" options={albumCoverSize} />
            <PreferenceToggleRow name="showLibraryFilter" value={preferences.showLibraryFilter} />
            <PreferenceToggleRow name="showAlbumTable" value={preferences.showAlbumTable} />
            <PreferenceTextRow rowName="vlcHost" value={preferences.vlcHost} />
            <PreferenceTextRow rowName="vlcPort" value={preferences.vlcPort} />
            <PreferenceTextRow rowName="vlcPassword" value={preferences.vlcPassword} />
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
