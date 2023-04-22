import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';

import AlbumAdminButtons from './AlbumAdminButtons';
import AlbumButtons from './AlbumButtons';
import AlbumCover from './AlbumCover';
import './AlbumDetail.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import { IQueue, ITrack } from '../interface';

interface IAlbumCoverAndButtons {
  queue: IQueue,
  setQueue: Function,
  tracks: ITrack[],
  setIsCustomSearchOpen: Function,
  setIsConfirmRemoveCoverArtOpen: Function,
  setConfirmRestriction: Function,
}

const AlbumCoverAndButtons: FC<IAlbumCoverAndButtons> = ({queue, setQueue, tracks, setIsCustomSearchOpen, setIsConfirmRemoveCoverArtOpen, setConfirmRestriction}) => {
  const { state } = useLocation();
  const album = state.currentAlbum;
  const settings = useContext(SettingsContext);

  const albumButtons = (
    <Container className="buttonContainer">
      <>
        <AlbumButtons
          queue={queue}
          setQueue={setQueue}
          tracks={tracks}
        />
        <AlbumAdminButtons
          setIsCustomSearchOpen={setIsCustomSearchOpen}
          setIsConfirmRemoveCoverArtOpen={setIsConfirmRemoveCoverArtOpen}
          setConfirmRestriction={setConfirmRestriction}
        />
      </>
    </Container>
  );

  const albumNameStyle = {
    color: settings?.styles?.fontColor,
    fontFamily: settings?.styles?.buttonFont,
  };

  return (
    <Col lg={3} xl={3}>
      <Container className="albumContainer">
        <Row>
          <AlbumCover album={album} />
        </Row>
        <Row className="albumName" style={albumNameStyle}>
          {album.name}
        </Row>
        <Row>{albumButtons}</Row>
      </Container>
    </Col>
  );
};

export default AlbumCoverAndButtons;
