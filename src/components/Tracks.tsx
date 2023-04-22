import Container from 'react-bootstrap/Container';
import { FC, useContext, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useIntl } from 'react-intl';

import { getTracks, searchTracks } from '../lib/librarian-client';
import { SettingsContext } from './layout/SettingsProvider';
import NoResults from './common/NoResults';
import TrackList from './TrackList';
import Paginator from './common/Paginator';
import Loading from './common/Loading';
import './Tracks.scss';
import { applyLighting } from '../lib/lightingHelper';
import { handlers } from '../lib/gesture-helper';
import { bigButtons, headerFooterReserve, topMargin } from '../lib/styleHelper';
import FullWidthRow from './common/FullWidthRow';

interface ITracks {
  setCurrentAlbum?: Function,
  search?: string,
};

const Tracks: FC<ITracks> = ({ setCurrentAlbum, search }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const [tracks, setTracks] = useState([]);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(1);
  const [tracksLoaded, setTracksLoaded] = useState(false);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let trackHeight = bigButtons(settings) ? 70 : 50;
  trackHeight = isScreenSmall ? 35 : trackHeight;
  const noResults = search && !tracks.length;

  useEffect(() => {
    const reserve = headerFooterReserve(settings);
    const itemHeight = trackHeight;
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
    applyLighting(settings, 'Tracks');
  }, []);

  const findTracks = async (start: any, limit: any) => {
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
        console.log(realStart, (realStart + realPageSize));
        getTracks(realStart, (realStart + realPageSize)).then((data) => {
          console.log(data);
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

    if (realPageSize > 1) {
      loadTracks();
    }
  }, [search, selectedPage, realPageSize]);

  const content = (
    <TrackList
      tracks={tracks}
      showAlbumCovers
    />
  );

  const trackList = () => {
    if (realPageSize && totalTracks) {
      return (
        <Container className="tracksContainer" {...swipe} fluid style={{ marginTop: topMargin(settings) }}>
          <FullWidthRow>{content}</FullWidthRow>
          <FullWidthRow>
            <Paginator
              onPageChange={(page: any) => setSelectedPage(page)}
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
        <NoResults title={intl.formatMessage({ id: 'no_tracks_title' })} text={intl.formatMessage({ id: 'no_tracks_text' })} />
      )}
      {tracksLoaded && noResults && (
        <div className="no-albums">
          <NoResults title={intl.formatMessage({ id: 'no_search_results_title' })} text={intl.formatMessage({ id: 'no_search_results_text' })} />
        </div>
      )}
      {searchInProgress && <Loading text="Loading..." />}
      {!noResults && !searchInProgress && (
        <>
          {trackList()}
        </>
      )}
    </>
  );
};

export default Tracks;
