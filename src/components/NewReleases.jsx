import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  Container,
  Row,
} from 'react-bootstrap';
import Album from './Album';
import SpotifyClient from '../lib/spotify-client';

function NewReleases() {
  const maxAvailableNewReleases = 50;
  const limit = 20;
  const [start, setStart] = useState(0);
  const [albums, setAlbums] = useState([]);

  const loadAlbums = (start, limit) => {
    SpotifyClient.getAccessToken().then((token) => {
      if (!window.accessToken) {
        window.accessToken = token.access_token;
      }

      SpotifyClient.newReleases(start, limit).then((data) => {
        setAlbums(albums.concat(data.albums.items));
        setStart(start + limit);
      });
    });
  };

  if (!albums.length) {
    loadAlbums(start, limit);
  }

  const renderAlbums = () => {
    const items = [];
    if (albums) {
      for (let i = 0; i < albums.length; i += 1) {
        items.push(
          <Album key={i} album={albums[i]} coverArt={albums[i].images[1].url} />,
        );
      }
    }
    return items;
  };

  if (albums.length < maxAvailableNewReleases) {
    return (
      <Container>
        <Row>
          {renderAlbums()}
        </Row>
        <Row>
          <Button block variant="outline-info" onClick={() => { loadAlbums(start, limit); }}>Load More</Button>
        </Row>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
        {renderAlbums()}
      </Row>
    </Container>
  );
}
export default NewReleases;

NewReleases.propTypes = {
  search: PropTypes.string,
};
NewReleases.defaultProps = {
  search: '',
};
