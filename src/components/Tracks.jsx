import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { getTracks, searchTracks } from '../lib/librarian-client';
import TrackList from './TrackList';
import Paginator from './common/Paginator';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function Tracks({ search, setCurrentAlbum }) {
  const [tracks, setTracks] = useState([]);
  const [totalTracks, setTotalTracks] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  useEffect(() => {

    const albumsPerRow = Math.floor(window.innerWidth / 300);
    const numberOfRows = Math.floor((window.innerHeight - 200) / 200);
    const s = albumsPerRow * numberOfRows;
    setRealPageSize(s);
  }, []);

  const onPageChange = (page) => {
    setSelectedPage(page);
  }

  const findTracks = async (start, limit) => {
    searchTracks(search, start, limit).then((data) => {
      setTotalTracks(data.totalTracks);
      setTracks(data.tracks);
    });
  };

  const loadTracks = () => {
    // 1: 0
    // 2: 2 * 12 == 24 - 12 = 12
    // 3: 3 * 12 == 36 - 12 = 24
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    if (realStart >= 0 && realPageSize) {
      if (search) {
        findTracks(realStart, (realStart + realPageSize));
      } else {
        getTracks(realStart, (realStart + realPageSize)).then((data) => {
          setTotalTracks(data.totalTracks);
          setTracks(data.tracks);
        });
      }
    }
  };

  useEffect(() => setSelectedPage(1), [search]);
  useEffect(() => {
    if (realPageSize && selectedPage) {
      loadTracks();
    }
  }, [selectedPage]);

  useEffect(() => {
    if (selectedPage && realPageSize) {
      loadTracks();
    }
  }, [realPageSize]);

  const alert = () => {
    const alertText = "Loading tracks.  If you don't see any results, set up your library in Settings.";
    if (!tracks || !tracks.length) {
      return <Alert variant="primary">{alertText}</Alert>;
    }
    return <></>;
  };

  const content = (
    <TrackList
      style={{ width: '100%', marginRight: '0px' }}
      tracks={tracks}
      showAlbumCovers
      setCurrentAlbum={setCurrentAlbum}
    />
  );

  const trackList = () => {
    if (realPageSize && totalTracks) {
      return (
        <Container fluid style={{ marginTop: '60px' }}>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>{content}</Row>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Paginator
                onPageChange={(page) => setSelectedPage(page)}
                style={{ marginTop: '100px' }}
                selectedPage={selectedPage}
                totalItems={totalTracks}
                pageSize={realPageSize}
              />
            </Col>
          </Row>
        </Container>
      );
    }
  };

  return (
    <>
      {alert()}
      {trackList()}
    </>
  );
}

Tracks.propTypes = propTypes;
Tracks.defaultProps = {
  search: '',
};

export default Tracks;
