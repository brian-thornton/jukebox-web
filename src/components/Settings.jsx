import React from 'react';
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import LibraryList from './LibraryList';

function Settings() {
  return (
    <Container>
      <Row>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="spotifyClient">Spotify Client ID:</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Spotify Client ID"
            aria-label="Spotify Client ID:"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="spotifySecret">Spotify Client Secret:</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Spotify Client Secret"
            aria-label="Spotify Client Secret:"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Row>
      <Row>
        <Col lg={12} xl={12}>
          <LibraryList />
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;
