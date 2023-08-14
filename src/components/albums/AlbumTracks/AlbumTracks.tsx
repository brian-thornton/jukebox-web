import { useSwipeable } from 'react-swipeable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import './AlbumTracks.scss';
import { handlers } from '../../../lib/gesture-helper';
import { calculatePageSize } from '../../../lib/styleHelper';
import { SettingsContext } from '../../layout/SettingsProvider';
import { ITrack, IQueue } from '../../interface';
import AddToPlaylistButton from '../../common/AddToPlaylistButton/AddToPlaylistButton';
import DownloadButton from '../../DownloadButton';
import EnqueueButton from '../../EnqueueButton';
import Item from '../../common/Item/Item';
import Paginator from '../../common/Paginator/Paginator';
import PlayNowButton from '../../PlayNowButton';
import TrackActions from '../../TrackActions';
import AlbumTrackButtons from '../AlbumTrackButtons/AlbumTrackButtons';

interface IAlbumTracks {
  tracks: Array<ITrack>,
  queue?: IQueue,
  setQueue: Function,
  setClickedTrack: Function,
  clickedTrack: ITrack | undefined,
};

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
      return screen?.isMobile ? (
        <Item
          onClick={() => setClickedTrack(track)}
          text={track.name}
          buttons={albumModeButtons(track)}
        />
      ) : (
        <Item
          onClick={() => { }}
          text={track.name}
          buttons={(
            <>
              {albumModeButtons(track)}
              {features?.downloadTrack && (
                <DownloadButton track={track} />
              )}
            </>
          )}
        />
      )
    })
  );

  return (
    <Container {...swipe} fluid style={{ marginBottom: isScreenSmall ? '90px' : '' }}>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Row>
            {trackRows()}
          </Row>
        </Col>
      </Row>
      {tracks.length > pageSize && (
        <Row className="d-none d-md-block d-lg-block album-tracks-paginator">
          <Col lg="12" xl="12" md="12" sm="12">
            <Paginator
              disableRandom
              onPageChange={(page: any) => setSelectedPage(page)}
              selectedPage={selectedPage}
              totalItems={tracks.length}
              pageSize={pageSize}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AlbumTracks;
