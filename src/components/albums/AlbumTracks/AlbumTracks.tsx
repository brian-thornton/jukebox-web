import { useSwipeable } from 'react-swipeable';
import { FC, useEffect, useState, useContext } from 'react';

import { handlers } from '../../../lib/helper/gesture-helper';
import { calculatePageSize } from '../../../lib/helper/styleHelper';
import { SettingsContext } from '../../layout/SettingsProvider';
import { ITrack, IQueue } from '../../interface';
import AddToPlaylistButton from '../../common/Buttons/AddToPlaylistButton/AddToPlaylistButton';
import EnqueueButton from '../../common/Buttons/EnqueueButton';
import Item from '../../common/Item/Item';
import Paginator from '../../common/Paginator/Paginator';
import PlayNowButton from '../../common/Buttons/PlayNowButton';
import TrackActions from '../TrackActions';
import AlbumTrackButtons from '../AlbumTrackButtons/AlbumTrackButtons';
import classes from './AlbumTracks.module.css';

interface IAlbumTracks {
  tracks: Array<ITrack>,
  queue?: IQueue,
  setQueue: Function,
  setClickedTrack: Function,
  clickedTrack: ITrack | undefined,
}

const AlbumTracks: FC<IAlbumTracks> = ({ tracks, queue, setQueue, clickedTrack, setClickedTrack }) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall, screen, styles } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const swipe = useSwipeable(
    handlers(setSelectedPage, selectedPage, Math.ceil(tracks.length / pageSize))
  );
  let content = [];
  const trackHeight = (!styles?.controlButtonSize || styles?.controlButtonSize === 'small') ? 53 : 80;
  const reserve = (!styles?.controlButtonSize || styles?.controlButtonSize === 'small') ? 200 : 250;

  const inQueue = (track: ITrack): boolean => (
    queue?.tracks?.filter(t => t.path === track.path).length ? true : false
  );

  useEffect(() => {
    if (screen?.isMobile) {
      setPageSize(9);
    } else {
      setPageSize(calculatePageSize('item', reserve, trackHeight));
    }
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * pageSize) - pageSize);

  const albumModeButtons = (track: any) => (
    <>
      {features?.play && <PlayNowButton track={track} />}
      {features?.queue && (
        <EnqueueButton
          mode="Albums"
          track={track}
          disabled={inQueue(track)}
          isSelected={inQueue(track)}
          onComplete={() => {
            const clone = { ...queue };
            clone?.tracks?.push(track);
            setQueue(clone);
          }} />
      )}
      {features?.playlists && <AddToPlaylistButton track={track} />}
    </>
  );

  content = tracks.slice(realStart, (realStart + pageSize)).map(track => (
    <Item
      onClick={() => { }}
      text={track.name}
      buttons={(
        <AlbumTrackButtons track={track} />
      )}
    />
  ));

  if (isScreenSmall && clickedTrack) {
    return <TrackActions track={clickedTrack} onClose={() => setClickedTrack(undefined)} />;
  }

  const trackRows = () => (
    tracks.slice(realStart, (realStart + pageSize)).map(track => {
      return (
        <Item
          onClick={screen?.isMobile ? () => setClickedTrack(track) : () => { }} 
          text={track.name}
          buttons={albumModeButtons(track)}
        />
      )
    })
  );

  return (
    <div className={classes.albumTrackContainer}>
      <div className={classes.trackContainer} {...swipe} >
        {trackRows()}
        {tracks.length > pageSize && (
          <Paginator
            disableRandom
            onPageChange={(page: any) => setSelectedPage(page)}
            totalItems={tracks.length}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  )
};

export default AlbumTracks;
