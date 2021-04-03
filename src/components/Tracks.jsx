import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import TrackList from './TrackList';
import { Settings } from './shapes';
import { getRandomInt } from '../lib/pageHelper';
import PagingButtons from './PagingButtons';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
};

function Tracks({ search, pages, page, setTrackPage, settings, setCurrentAlbum }) {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageDisabled, setPageDisabled] = useState(true);
  const isScreenSmall = window.innerWidth < 700;
  const findPage = () => pages.findIndex(p => p.start === page.start && p.limit === page.limit);
  const loadMore = () => setTrackPage(pages[findPage() + 1]);
  const loadPrevious = () => setTrackPage(pages[findPage() - 1]);

  const loadTracks = (loadPage) => {
    setIsLoading(true);
    if (search) {
      LibrianClient.searchTracks(search).then((data) => {
        setTracks(data);
        setIsLoading(false);
        setIsLoaded(true);
      });
    } else {
      const start = loadPage ? loadPage.start : page.start;
      let limit = loadPage ? loadPage.limit : page.limit;

      if (start === 0) {
        limit += 1;
      }

      LibrianClient.getTracks(start, limit).then((data) => {
        setTracks(data);
        setIsLoading(false);
        setPageDisabled(false);
      });
    }
  };

  useEffect(() => loadTracks(), [search]);

  if ((search && !isLoaded && !isLoading) || (!tracks.length && !isLoading)) {
    loadTracks();
  }

  useEffect(() => {
    setIsLoading(true);
    loadTracks();
  }, [page])

  const alert = () => {
    const alertText = "Loading tracks.  If you don't see any results, set up your library in Settings.";
    if (!tracks || !tracks.length) {
      return <Alert variant="primary">{alertText}</Alert>;
    }
    return <React.Fragment />;
  };

  const loadRandom = () => setTrackPage(pages[getRandomInt(pages.length)]);

  const tracksMargin = () => {
    return isScreenSmall ? {} : { marginLeft: '0px', marginTop: '50px', marginRight: '0px', height: '100%' };
  };

  const trackList = () => {
    if (tracks.length) {
      return (
        <Container id="tracks" fluid style={tracksMargin()}>Î
          <Row style={{ marginRight: '0px', padding: '0px' }}>
            <Col lg={11} xl={11}>
              <TrackList style={{ width: '100%', marginRight: '0px' }}
                tracks={tracks}
                settings={settings}
                showAlbumCovers
                setCurrentAlbum={setCurrentAlbum}
              />
            </Col>
            <Col lg={1} xl={1}>
              <PagingButtons
                settings={settings}
                search={search}
                pageDisabled={pageDisabled}
                loadMore={loadMore}
                loadPrevious={loadPrevious}
                loadRandom={loadRandom}
                pages={pages}
                page={page}
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
