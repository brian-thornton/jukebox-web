import { FC, useContext, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useIntl } from 'react-intl';

import { SettingsContext } from './layout/SettingsProvider';
import NoResults from './common/NoResults/NoResults';
import TrackList from './TrackList';
import Paginator from './common/Paginator/Paginator';
import Loading from './common/Loading/Loading';

import styles from './Tracks.module.css';
import { applyLighting } from '../lib/helper/lightingHelper';
import { handlers } from '../lib/helper/gesture-helper';
import { bigButtons, headerFooterReserve } from '../lib/helper/styleHelper';
import { useTracks } from '../hooks/use-tracks';

interface ITracks {
  search?: string,
}

const Tracks: FC<ITracks> = ({ search }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const { isScreenSmall, screen } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(1);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let trackHeight = bigButtons(settings) ? 70 : 50;
  trackHeight = isScreenSmall ? 35 : trackHeight;
  const { totalTracks, tracks, tracksLoaded, searchInProgress } = useTracks(selectedPage, realPageSize, search); 
  const noResults = search && !tracks.length;

  useEffect(() => {
    const reserve = headerFooterReserve(settings);
    const itemHeight = trackHeight;
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
    applyLighting(settings, 'Tracks');
  }, []);

  const content = (
    <TrackList
      tracks={tracks}
      showAlbumCovers
    />
  );

  const trackList = () => realPageSize && totalTracks ? (
    <div className={styles.container} {...swipe}>
      <div className={styles.tracksContainer}>
        {content}
        {!screen?.isMobile && (
          <Paginator
            onPageChange={(page: any) => setSelectedPage(page)}
            selectedPage={selectedPage}
            totalItems={totalTracks}
            pageSize={realPageSize}
          />
        )}
      </div>
    </div>
  ) : <></>;

  return (
    <>
      {tracksLoaded && totalTracks === 0 && (
        <NoResults title={intl.formatMessage({ id: 'no_tracks_title' })} text={intl.formatMessage({ id: 'no_tracks_text' })} />
      )}
      {tracksLoaded && noResults && (
        <div>
          <NoResults title={intl.formatMessage({ id: 'no_search_results_title' })} text={intl.formatMessage({ id: 'no_search_results_text' })} />
        </div>
      )}
      {searchInProgress && <Loading text="Loading..." />}
      {!noResults && !searchInProgress && trackList()}
    </>
  );
};

export default Tracks;
