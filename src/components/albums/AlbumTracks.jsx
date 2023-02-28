import { PropTypes } from 'prop-types';
import { useSwipeable } from 'react-swipeable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import './AlbumTracks.scss';
import { handlers } from '../../lib/gesture-helper';
import { calculatePageSize } from '../../lib/styleHelper';
import { SettingsContext } from '../layout/SettingsProvider';
import { Track } from '../shapes';
import AddToPlaylistButton from '../common/AddToPlaylistButton';
import DownloadButton from '../DownloadButton';
import EnqueueButton from '../EnqueueButton';
import Item from '../common/Item';
import Paginator from '../common/Paginator';
import PlayNowButton from '../PlayNowButton';

const propTypes = {
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(Track),
  queue: PropTypes.arrayOf(Track),
  setQueue: PropTypes.func.isRequired,
};

const TrackList = ({ tracks, queue, setQueue }) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState();
  const swipe = useSwipeable(
    handlers(setSelectedPage, selectedPage, Math.ceil(tracks.length / pageSize))
  );
  let content = [];
  const { controlButtonSize } = settings.styles;
  const trackHeight = (!controlButtonSize || controlButtonSize === 'small') ? 53 : 80;
  const reserve = (!controlButtonSize || controlButtonSize === 'small') ? 200 : 250;

  const inQueue = (track) => {
    return queue?.tracks?.filter(t => t.path === track.path).length > 0;
  };

  useEffect(() => {
    setPageSize(calculatePageSize('item', reserve, trackHeight));
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * pageSize) - pageSize);

  const albumModeButtons = track => (
    <>
      {features.play && <PlayNowButton track={track} />}
      {features.queue && (
        <EnqueueButton
          mode="Albums"
          track={track}
          disabled={inQueue(track)}
          isSelected={inQueue(track)}
          onComplete={() => {
            const clone = { ...queue };
            clone.tracks.push(track);
            setQueue(clone);
          }} />
      )}
      {features.playlists && <AddToPlaylistButton track={track} />}
    </>
  );

  content = tracks.slice(realStart, (realStart + pageSize)).map(track => (
    <Item
      text={track.name}
      buttons={(
        <>
          {features.play && <PlayNowButton track={track} />}
          {features.queue && <EnqueueButton track={track} />}
          {features.playlists && <AddToPlaylistButton track={track} />}
          {features.downloadTrack && <DownloadButton track={track} />}
        </>
      )}
    />
  ));

  return (
    <Container {...swipe} fluid style={{ marginBottom: isScreenSmall ? '90px' : '' }}>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Row className="d-none d-md-block d-lg-block">
            {tracks.slice(realStart, (realStart + pageSize)).map(track => (
              <Item
                text={track.name}
                buttons={(
                  <>
                    {albumModeButtons(track)}
                    {features.downloadTrack && (
                      <DownloadButton track={track} />
                    )}
                  </>
                )}
              />
            ))}
          </Row>
          <Row className="d-block d-sm-none">
            {tracks.map(track => (
              <Item
                text={track.name}
                buttons={albumModeButtons(track)}
              />
            ))}
          </Row>
        </Col>
      </Row>
      {tracks.length > pageSize && (
        <Row className="d-none d-md-block d-lg-block album-tracks-paginator">
          <Col lg="12" xl="12" md="12" sm="12">
            <Paginator
              disableRandom
              onPageChange={page => setSelectedPage(page)}
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

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  tracks: [],
  queue: [],
};

export default TrackList;
