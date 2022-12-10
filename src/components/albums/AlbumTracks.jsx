import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useSwipeable } from 'react-swipeable';

import AddToPlaylistButton from '../common/AddToPlaylistButton';
import DownloadButton from '../DownloadButton';
import EnqueueButton from '../EnqueueButton';
import Item from '../common/Item';
import Paginator from '../common/Paginator';
import PlayNowButton from '../PlayNowButton';
import { SettingsContext } from '../layout/SettingsProvider';
import { Track } from '../shapes';
import { handlers } from '../../lib/gesture-helper';
import './AlbumTracks.scss';
import { pageSize } from '../../lib/styleHelper';

const propTypes = {
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(Track),
};

const TrackList = ({ tracks }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [totalPages, setTotalPages] = useState();
  const isScreenSmall = window.innerWidth < 700;
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let content = [];

  const { controlButtonSize } = settings.styles;
  const trackHeight = (!controlButtonSize || controlButtonSize === 'small') ? 53 : 80;
  const reserve = (!controlButtonSize || controlButtonSize === 'small') ? 200 : 250;

  useEffect(() => {
    setRealPageSize(pageSize('item', reserve, trackHeight));
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  const albumModeButtons = track => (
    <>
      {features.play && <PlayNowButton track={track} />}
      {features.queue && <EnqueueButton mode="Albums" track={track} />}
      {features.playlists && <AddToPlaylistButton track={track} />}
    </>
  );

  content = tracks.slice(realStart, (realStart + realPageSize)).map(track => (
    <Item
      text={track.name}
      buttons={(
        <>
          {features.play && <PlayNowButton track={track} />}
          {features.queue && <EnqueueButton track={track} />}
          {features.playlists && <AddToPlaylistButton track={track} />}
          {features.downloadTrack && <DownloadButton track={track} isScreenSmall={isScreenSmall} />}
        </>
      )}
    />
  ));

  return (
    <Container {...swipe} fluid style={{ marginBottom: isScreenSmall ? '90px' : '' }}>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Row className="d-none d-md-block d-lg-block">
            {tracks.slice(realStart, (realStart + realPageSize)).map(track => (
              <Item
                text={track.name}
                buttons={(
                  <>
                    {albumModeButtons(track)}
                    {features.downloadTrack && (
                      <DownloadButton track={track} isScreenSmall={isScreenSmall} />
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
      {tracks.length > realPageSize && (
        <Row className="d-none d-md-block d-lg-block album-tracks-paginator">
          <Col lg="12" xl="12" md="12" sm="12">
            <Paginator
              disableRandom
              onPageChange={page => setSelectedPage(page)}
              selectedPage={selectedPage}
              totalItems={tracks.length}
              pageSize={realPageSize}
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
};

export default TrackList;
