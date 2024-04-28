import { FC, useContext, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import NoResults from '../../common/NoResults/NoResults';
import TrackList from '../TrackList/TrackList';
import Paginator from '../../common/Paginator/Paginator';
import Loading from '../../common/Loading/Loading';

import styles from './Tracks.module.css';
import { applyLighting } from '../../../lib/helper/lightingHelper';
import { handlers } from '../../../lib/helper/gesture-helper';
import { useTracks } from '../../../hooks/use-tracks';

interface ITracks {
  search?: string,
}

const Tracks: FC<ITracks> = ({ search }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const { screen, rowPageSize } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const { totalTracks, tracks, tracksLoaded, searchInProgress } = useTracks(selectedPage, rowPageSize, search);
  const noResults = search && !tracks.length;

  useEffect(() => {
    applyLighting(settings, 'Tracks');
  }, []);

  const content = (
    <TrackList
      tracks={tracks}
      showAlbumCovers
    />
  );

  const trackList = () => rowPageSize && totalTracks ? (
    <div className={styles.container} {...swipe}>
      <div className={styles.tracksContainer}>
        {content}
        {!screen?.isMobile && (
          <Paginator
            onPageChange={(page: any) => setSelectedPage(page)}
            totalItems={totalTracks}
          />
        )}
      </div>
    </div>
  ) : <></>;

  const renderNoResults = (titleId: string, textId: string) => (
    <NoResults
      title={intl.formatMessage({ id: titleId })}
      text={intl.formatMessage({ id: textId })}
    />
  );
  
  return (
    <>
      {searchInProgress && <Loading text="Loading..." />}
      {tracksLoaded && totalTracks === 0 && !noResults && renderNoResults('no_tracks_title', 'no_tracks_text')}
      {tracksLoaded && noResults && renderNoResults('no_search_results_title', 'no_search_results_text')}
      {!noResults && !searchInProgress && trackList()}
    </>
  );
};

export default Tracks;
