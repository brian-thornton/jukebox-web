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

const propTypes = {
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(Track),
};

const TrackList = ({ tracks }) => {
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const isScreenSmall = window.innerWidth < 700;
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let content = [];

  useEffect(() => {
    const numberOfTracks = Math.floor((window.innerHeight - 200) / 50);
    setRealPageSize(numberOfTracks);
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  content = tracks.slice(realStart, (realStart + realPageSize)).map(track => (
    <Item
      text={track.name}
      buttons={(
        <>
          {settings.features.play && <PlayNowButton track={track} />}
          {settings.features.queue && <EnqueueButton track={track} />}
          {settings.features.playlists && <AddToPlaylistButton track={track} />}
          {settings.features.downloadTrack && <DownloadButton track={track} isScreenSmall={isScreenSmall} />}
        </>
      )}
    />
  ));

  return (
    <Container {...swipe} fluid>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Row className="d-none d-md-block d-lg-block">
            {tracks.slice(realStart, (realStart + realPageSize)).map(track => (
              <Item
                text={track.name}
                buttons={(
                  <>
                    {settings.features.play && <PlayNowButton track={track} />}
                    {settings.features.queue && <EnqueueButton mode="Albums" track={track} />}
                    {settings.features.playlists && <AddToPlaylistButton track={track} />}
                    {settings.features.downloadTrack && <DownloadButton track={track} isScreenSmall={isScreenSmall} />}
                  </>
                )}
              />
            ))}
          </Row>
          <Row className="d-block d-sm-none">
            {tracks.map(track => (
              <Item
                text={track.name}
                buttons={(
                  <>
                    {settings.features.play && <PlayNowButton track={track} />}
                    {settings.features.queue && <EnqueueButton mode="Albums" track={track} />}
                    {settings.features.playlists && <AddToPlaylistButton track={track} />}
                  </>
                )}
              />
            ))}
          </Row>
        </Col>
      </Row>
      <Row className="d-none d-md-block d-lg-block album-tracks-paginator">
        <Col lg="12" xl="12" md="12" sm="12">
          <Paginator
            disableRandom
            onPageChange={(page) => setSelectedPage(page)}
            selectedPage={selectedPage}
            totalItems={tracks.length}
            pageSize={realPageSize}
          />
        </Col>
      </Row>
    </Container>
  );
}

TrackList.propTypes = propTypes;
TrackList.defaultProps = {
  tracks: [],
};

export default TrackList;
