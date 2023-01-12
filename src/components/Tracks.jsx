import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FormattedMessage } from 'react-intl';

import { getTracks, searchTracks } from '../lib/librarian-client';
import { SettingsContext } from './layout/SettingsProvider';
import NoResults from './common/NoResults';
import TrackList from './TrackList';
import Paginator from './common/Paginator';
import Loading from './common/Loading';
import './Tracks.scss';
import { applyLighting } from '../lib/lightingHelper';
import { handlers } from '../lib/gesture-helper';
import { headerFooterReserve, topMargin } from '../lib/styleHelper';
import FullWidthRow from './common/FullWidthRow';

const propTypes = {
  setCurrentAlbum: PropTypes.func.isRequired,
};

const Tracks = ({ setCurrentAlbum, search }) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const { controlButtonSize } = settings.styles;
  const [tracks, setTracks] = useState([]);
  const [searchInProgress, setSearchInProgress] = useState();
  const [totalTracks, setTotalTracks] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [tracksLoaded, setTracksLoaded] = useState(false);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let trackHeight = ['large', 'medium'].includes(controlButtonSize) ? 70 : 50;
  trackHeight = isScreenSmall ? 35 : trackHeight;
  const noResults = search && !tracks.length;

  useEffect(() => {
    const reserve = headerFooterReserve(settings);
    const itemHeight = trackHeight;
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
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
    />
  );

  const trackList = () => {
    if (realPageSize && totalTracks) {
      return (
        <Container className="tracksContainer" {...swipe} fluid style={{ marginTop: topMargin(settings) }}>
          <FullWidthRow>{content}</FullWidthRow>
          <FullWidthRow>
            <Paginator
              onPageChange={page => setSelectedPage(page)}
              selectedPage={selectedPage}
              totalItems={totalTracks}
              pageSize={realPageSize}
            />
          </FullWidthRow>
        </Container>
      );
    }

    return <></>;
  };

  return (
    <>
      {tracksLoaded && totalTracks === 0 && (
        <NoResults title={<FormattedMessage id="no_tracks_title" />} text={<FormattedMessage id="no_tracks_text" />} marginTop="60px" />
      )}
      {tracksLoaded && noResults && (
        <div className="no-albums">
          <NoResults title={<FormattedMessage id="no_search_results_title" />} text={<FormattedMessage id="no_search_results_text" />} marginTop="60px" />
        </div>
      )}
      {searchInProgress && <Loading />}
      {!noResults && !searchInProgress && (
        <>
          {trackList()}
        </>
      )}
    </>
  );
};

Tracks.propTypes = propTypes;
Tracks.defaultProps = {
  search: '',
};

export default Tracks;
