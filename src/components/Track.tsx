import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import AddToPlaylistButton from './common/AddToPlaylistButton';
import TrackAlbum from './TrackAlbum';
import { ITrack as TrackShape, IAlbum } from './interface';
import DownloadButton from './DownloadButton';
import ExpandRow from './common/ExpandRow';
import GoToAlbumButton from './GoToAlbumButton';
import PlayNowButton from './PlayNowButton';
import EnqueueButton from './EnqueueButton';
import { SettingsContext } from './layout/SettingsProvider';
import { bigButtons } from '../lib/styleHelper';
import './Track.scss';

interface ITrack {
  setCurrentAlbum?: Function,
  showAlbumCovers: boolean,
  track: TrackShape,
  trackAlbums: Array<IAlbum>,
  trackAlbumsLoaded: boolean,
};

const Track: FC<ITrack> = ({
  showAlbumCovers,
  setCurrentAlbum,
  track,
  trackAlbums,
  trackAlbumsLoaded,
}) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall } = settings;
  const fontSize = bigButtons(settings) ? '25px' : '';

  const getAlbum = (albumTrack: any) => {
    if (trackAlbumsLoaded) {
      return trackAlbums.find(trackAlbum => trackAlbum.path === albumTrack.path.substr(0, albumTrack.path.lastIndexOf('/')));
    }

    return undefined;
  };

  const album = (albumTrack: any) => {
    const ta = getAlbum(albumTrack);

    if (showAlbumCovers && ta) {
      if (settings && features) {
        return (
          <TrackAlbum
            // @ts-ignore
            album={ta}
          />
        );
      }
    }

    return <></>;
  };

  const trackCardSkin = {
    color: settings?.styles?.fontColor,
    background: settings?.styles?.trackBackgroundColor,
  };

  const trackNameSkin = {
    fontFamily: settings?.styles?.listFont,
    fontSize,
  };

  // TODO: Make this work with \
  const pathParts = track.path.split('/');
  const albumFolder = pathParts[pathParts.length - 2];

  const buttons = (
    <>
      {features?.albums && <GoToAlbumButton album={getAlbum(track)} />}
      {features?.playlists && <AddToPlaylistButton track={track} />}
      {features?.play && <PlayNowButton track={track} />}
      {features?.queue && <EnqueueButton track={track} mode="Tracks" />}
      {features?.downloadTrack && <DownloadButton track={track} />}
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

export default Track;
