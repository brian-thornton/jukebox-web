import React, { useState, useEffect } from 'react';
import {
  Alert,
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import TrackList from './TrackList';

function Tracks({ search }) {
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(100);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTracks = () => {
    console.log(`loading tracks for ${search}`);
    setIsLoading(true);
    if (search) {
      LibrianClient.searchTracks(search).then(data => {
        setTracks(data);
        setIsLoading(false);
        setIsLoaded(true);
      });
    } else {
      LibrianClient.getTracks(start, limit).then(data => {
        setTracks(tracks.concat(data));
        setIsLoading(false);
;      });
    }
  }

  const loadMore = () => {
    setStart(limit);
    setLimit(limit + 100);
    loadTracks();
  }

  if ((search && !isLoaded && !isLoading) || (!tracks.length && !isLoading)) {
    loadTracks();
  }

  const alert = () => {
    if (!tracks || !tracks.length) {
      return <Alert variant="primary">Loading tracks.  If you don't see any results, set up your library in Settings.</Alert>;
    } else {
      return <React.Fragment />;
    }
  };

  return (
    <Container>
      <Row>
        <Col lg={12} xl={12}>
          {alert()}
          <TrackList tracks={tracks} />
          <Button block variant="outline-info" onClick={loadMore}>Load More</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Tracks;