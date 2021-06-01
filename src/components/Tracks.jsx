import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { getTracks, searchTracks } from '../lib/librarian-client';
import TrackList from './TrackList';
import { getHeight, nextPage, previousPage, initializePaging, initHorizontalPaging, randomPage } from '../lib/pageHelper';
import PagingButtons from './common/PagingButtons';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function Tracks({ search, setCurrentAlbum }) {
  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());

  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageDisabled, setPageDisabled] = useState(true);
  const isScreenSmall = window.innerWidth < 700;

  const loadTracks = (loadPage) => {
    setIsLoading(true);
    if (search) {
      searchTracks(search).then((data) => {
        setTracks(data);
        setIsLoading(false);
        setIsLoaded(true);
      });
    } else {
      const start = loadPage ? loadPage.start : paging ? paging.currentPage.start : 0;
      let limit = loadPage ? loadPage.limit : paging ? paging.currentPage.limit : 5;

      if (start === 0) {
        limit += 1;
      }

      getTracks(start, limit).then((data) => {
        setTracks(data.tracks);
        setIsLoading(false);
        setPageDisabled(false);

        if (!paging) {
          //setPaging(initializePaging(data.totalTracks, 200, initialHeight));
          setPaging(initHorizontalPaging(data.totalTracks, 175, initialHeight, 300));
        }
      });
    }
  };

  useEffect(() => loadTracks(), [search]);

  const alert = () => {
    const alertText = "Loading tracks.  If you don't see any results, set up your library in Settings.";
    if (!tracks || !tracks.length) {
      return <Alert variant="primary">{alertText}</Alert>;
    }
    return <React.Fragment />;
  };

  const tracksMargin = () => {
    return isScreenSmall ? {} : { marginLeft: '0px', marginTop: '50px', marginRight: '0px', height: '100%' };
  };

  useEffect(() => {
    if (paging) {
      loadTracks(paging.currentPage);
    }
  }, [paging]);

  const trackList = () => {
    if (paging && tracks.length) {
      return (
        <Container id="tracks" fluid style={tracksMargin()}>
          <Row style={{ marginRight: '0px', padding: '0px' }}>
            <Col lg={11} xl={11}>
              <TrackList style={{ width: '100%', marginRight: '0px' }}
                tracks={tracks}
                showAlbumCovers
                setCurrentAlbum={setCurrentAlbum}
              />
            </Col>
            <Col lg={1} xl={1}>
              <PagingButtons
                search={search}
                pageDisabled={pageDisabled}
                loadMore={() => setPaging(nextPage(paging))}
                loadPrevious={() => setPaging(previousPage(paging))}
                loadRandom={() => setPaging(randomPage(paging))}
                pages={paging.pages}
                page={paging.currentPage}
              />
            </Col>
          </Row>
        </Container>
      );
    }

    return <React.Fragment />;
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
