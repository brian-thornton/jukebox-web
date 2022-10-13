import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { useSwipeable } from 'react-swipeable';

import { getTracks, searchTracks } from '../lib/librarian-client';
import { SettingsContext } from './layout/SettingsProvider';
import NoResults from './common/NoResults';
import TrackList from './TrackList';
import Paginator from './common/Paginator';
import Loading from './common/Loading';
import './Tracks.scss';
import { applyLighting } from '../lib/lightingHelper';
import { handlers } from '../lib/gesture-helper';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

const Tracks = ({ search, setCurrentAlbum }) => {
  const settings = useContext(SettingsContext);
  const [addTracks, setAddTracks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [searchInProgress, setSearchInProgress] = useState();
  const [totalTracks, setTotalTracks] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [tracksLoaded, setTracksLoaded] = useState(false);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const alertText = "Loading tracks.  If you don't see any results, set up your library in Settings.";

  useEffect(() => {
      const itemHeight = 55;
      const viewPortHeight = Math.floor(window.innerHeight - 200);
      setRealPageSize(Math.floor(viewPortHeight / itemHeight));
      applyLighting(settings, 'Tracks');
  }, []);

  const findTracks = async (start, limit) => {
    searchTracks(search, start, limit).then((data) => {
      setTotalTracks(data.totalTracks);
      setTracks(data.tracks);
      setTracksLoaded(true);
      setSearchInProgress(false);
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
          setTracksLoaded(true);
          setSearchInProgress(false);
        });
      }
    }
  };

  useEffect(() => {
    setSearchInProgress(true);
    loadTracks();
  }, [search, selectedPage, realPageSize]);

  const content = (
    <TrackList
      tracks={tracks}
      showAlbumCovers
      setCurrentAlbum={setCurrentAlbum}
      setAddTracks={setAddTracks}
    />
  );

  const trackList = () => {
    if (realPageSize && totalTracks) {
      return (
        <Container className="tracksContainer" {...swipe} fluid>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>{content}</Row>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Paginator
                onPageChange={(page) => setSelectedPage(page)}
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

  const noResults = search && !tracks.length;

  return (
    <>
      {tracksLoaded && noResults && (
        <div className="no-albums">
          <NoResults title="No Results Found" text="No Tracks found matching your search. Please try again." marginTop="60px" />
        </div>
      )}
      {searchInProgress && <Loading />}
      {!noResults && !searchInProgress && (
        <>
          {(!tracks || !tracks.length) && <Alert variant="primary">{alertText}</Alert>}
          {trackList()}
        </>
      )}
    </>
  );
}

Tracks.propTypes = propTypes;
Tracks.defaultProps = {
  search: '',
};

export default Tracks;
