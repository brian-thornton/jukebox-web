import React from 'react';
import {
  Container,
  Row,
  InputGroup,
  FormControl,
} from 'react-bootstrap';

function SpotifySettings() {
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
    </Container>
  );
}

export default SpotifySettings;
