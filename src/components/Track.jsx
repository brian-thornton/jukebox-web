import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';

import AddToPlaylistButton from './common/AddToPlaylistButton';
import TrackAlbum from './TrackAlbum';
import { Track as TrackShape } from './shapes';
import DownloadButton from './DownloadButton';
import ExpandRow from './common/ExpandRow';
import GoToAlbumButton from './GoToAlbumButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/SettingsProvider';
import './Track.scss';

const propTypes = {
  setCurrentAlbum: PropTypes.func,
  showAlbumCovers: PropTypes.bool,
  track: TrackShape.isRequired,
  trackAlbums: PropTypes.arrayOf(TrackShape).isRequired,
  trackAlbumsLoaded: PropTypes.bool,
};

const Track = ({
  showAlbumCovers,
  setCurrentAlbum,
  track,
  trackAlbums,
  trackAlbumsLoaded,
}) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall } = settings;
  const { controlButtonSize } = settings.styles;

  let fontSize = '';

  if (controlButtonSize === 'large') {
    fontSize = '25px';
  }

  if (controlButtonSize === 'medium') {
    fontSize = '25px';
  }

  const getAlbum = (albumTrack) => {
    if (trackAlbumsLoaded) {
      return trackAlbums.find(trackAlbum => trackAlbum.path === albumTrack.path.substr(0, albumTrack.path.lastIndexOf('/')));
    }

    return null;
  };

  const album = (albumTrack) => {
    const ta = getAlbum(albumTrack);

    if (showAlbumCovers && ta) {
      if (settings && features) {
        return (
          <TrackAlbum
            album={ta}
            setCurrentAlbum={setCurrentAlbum}
          />
        );
      }
    }

    return <></>;
  };

  const trackCardSkin = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
  };

  const trackNameSkin = {
    fontFamily: settings.styles.listFont,
    fontSize,
  };

  // TODO: Make this work with \
  const pathParts = track.path.split('/');
  const albumFolder = pathParts[pathParts.length - 2];

  const buttons = (
    <>
      {features.albums && <GoToAlbumButton className="d-none d-sm-block d-md-none" album={getAlbum(track)} />}
      {features.playlists && <AddToPlaylistButton track={track} />}
      {features.play && <PlayNowButton track={track} />}
      {features.queue && <EnqueueButton track={track} mode="Tracks" />}
      {features.downloadTrack && <DownloadButton track={track} />}
    </>
  );

  if (isScreenSmall) {
    return (
      <ExpandRow text={`${albumFolder} - ${track.name}`} buttons={buttons} />
    );
  }

  return (
    <Card className="trackCard" style={trackCardSkin}>
      <Container className="trackContainer" fluid>
        <Row>
          <Col className="d-none d-sm-block" lg={1} md={1}>
            {album(track)}
          </Col>
          <Col lg={8} md={8}>
            <div className="trackName" style={trackNameSkin}>
              {`${albumFolder} - ${track.name}`}
            </div>
          </Col>
          <Col lg={3} md={3}>
            {buttons}
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

Track.defaultProps = {
  setCurrentAlbum: null,
  showAlbumCovers: false,
  trackAlbumsLoaded: false,
};

Track.propTypes = propTypes;

export default Track;
