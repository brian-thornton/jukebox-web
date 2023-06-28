import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import TrackAlbum from './TrackAlbum';
import { ITrack as TrackShape, IAlbum } from './interface';
import { SettingsContext } from './layout/SettingsProvider';
import { bigButtons } from '../lib/styleHelper';
import Item from './common/Item';
import './Track.scss';
import TrackButtons from './TrackButtons';

interface ITrack {
  showAlbumCovers: boolean,
  track: TrackShape,
  trackAlbums: Array<IAlbum>,
  trackAlbumsLoaded: boolean,
  setTrackClicked?: Function,
};

const Track: FC<ITrack> = ({
  showAlbumCovers,
  track,
  trackAlbums,
  trackAlbumsLoaded,
  setTrackClicked,
}) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall } = settings;
  const fontSize = bigButtons(settings) ? '25px' : '';
  const [clicked, setClicked] = useState(false);

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

  if (isScreenSmall) {
    return (
      <>
        {<Item text={`${albumFolder} - ${track.name}`} allowToggle={false} onClick={() => {
          if (settings?.isScreenSmall && setTrackClicked) {
            setTrackClicked(track);
          }
        }} />}
      </>
    );
  }

  return (
    <>
      {!clicked && (
        <Card className="trackCard" style={trackCardSkin}>
          <Container className="trackContainer" fluid>
            <Row style={{marginRight: '0'}}>
              <Col className="d-none d-sm-block" lg={1} md={1}>
                {album(track)}
              </Col>
              <Col lg={8} md={8}>
                <div className="trackName" style={trackNameSkin}>
                  {`${albumFolder} - ${track.name}`}
                </div>
              </Col>
              <Col lg={3} md={3}>
                <TrackButtons track={track} trackAlbums={trackAlbums} trackAlbumsLoaded={trackAlbumsLoaded} />
              </Col>
            </Row>
          </Container>
        </Card>
      )}
    </>
  );
};

export default Track;
