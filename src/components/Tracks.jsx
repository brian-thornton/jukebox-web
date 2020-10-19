import { PropTypes } from 'prop-types';
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
import { Settings } from './shapes';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
};

function Tracks({ search, settings, setCurrentAlbum }) {
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(50);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTracks = () => {
    setIsLoading(true);
    if (search) {
      LibrianClient.searchTracks(search).then((data) => {
        setTracks(data);
        setIsLoading(false);
        setIsLoaded(true);
      });
    } else {
      LibrianClient.getTracks(start, limit).then((data) => {
        setTracks(tracks.concat(data));
        setIsLoading(false);
      });
    }
  };

  useEffect(() => loadTracks(), [search]);

  const loadMore = () => {
    setStart(limit);
    setLimit(limit + 50);
    loadTracks();
  };

  if ((search && !isLoaded && !isLoading) || (!tracks.length && !isLoading)) {
    loadTracks();
  }

  const alert = () => {
    const alertText = "Loading tracks.  If you don't see any results, set up your library in Settings.";
    if (!tracks || !tracks.length) {
      return <Alert variant="primary">{alertText}</Alert>;
    }
    return <React.Fragment />;
  };

  const trackList = () => {
    if (tracks.length) {
      return (
        <React.Fragment>
          <TrackList
            tracks={tracks}
            settings={settings}
            showAlbumCovers
            setCurrentAlbum={setCurrentAlbum}
          />
          <Button block variant="outline-info" onClick={loadMore}>Load More</Button>
        </React.Fragment>
      );
    }

    return <React.Fragment />;
  };

  return (
    <Container>
      <Row>
        <Col lg={12} xl={12}>
          {alert()}
          {trackList()}
        </Col>
      </Row>
    </Container>
  );
}

Tracks.propTypes = propTypes;
Tracks.defaultProps = {
  search: '',
};

export default Tracks;
