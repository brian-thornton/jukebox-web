import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { handlers } from '../../../lib/helper/gesture-helper';
import { SettingsContext } from '../../layout/SettingsProvider';
import AlbumCover from '../AlbumCover/AlbumCover';
import { IAlbum } from '../../interface';
import { ListGroup } from 'react-bootstrap';
import styles from './VerticalAlbumList.module.css';

interface IAlbumList {
  albums?: Array<IAlbum>,
  selectedPage: number,
  setSelectedPage: Function,
}

const AlbumList: FC<IAlbumList> = ({
  albums,
  selectedPage,
  setSelectedPage
}) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
    padding: '0px',
  };

  return (
    <Container {...swipe} className={styles.verticalAlbumContainer}>
      <ListGroup>
        {albums?.map((album: IAlbum) => (
          <ListGroup.Item key={album.path} style={itemStyle}>
            <Container fluid className={styles.listContainer}>
              <Row
                onClick={() => {
                  navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
                }}>
                <Col xs="3">
                  <AlbumCover album={album} isListCover={true} />
                </Col>
                <Col xs="9">
                  {album.name}
                </Col>
              </Row>
            </Container>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default AlbumList;
