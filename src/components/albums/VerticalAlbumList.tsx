import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';

import './AlbumList.scss';
import { applyLighting } from '../../lib/lightingHelper';
import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import { handlers } from '../../lib/gesture-helper';
import { SettingsContext } from '../layout/SettingsProvider';
import AlbumCover from './AlbumCover';
import AlbumTable from './AlbumTable';
import FullWidthRow from '../common/FullWidthRow';
import Loading from '../common/Loading';
import Paginator from '../common/Paginator';
import StartsWithFilter from './StartsWithFilter';
import NoAlbumsLoaded from './NoAlbumsLoaded';
import NoAlbumSearchResults from './NoAlbumsSearchResults';
import { usePageSize } from './album-hooks';
import { IAlbum } from '../interface';
import { ListGroup } from 'react-bootstrap';

interface IAlbumList {
  albums?: Array<IAlbum>,
  selectedPage: number,
  setSelectedPage: Function,
};

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
    <Container {...swipe} style={{ marginTop: '60px', marginLeft: '0px', paddingLeft: '0px', paddingRight: '0px' }}>
      <ListGroup>
        {albums?.map((album: IAlbum) => (
          <ListGroup.Item key={album.path} style={itemStyle}>
            <Container fluid style={{ marginLeft: '0px', paddingLeft: '0px', paddingRight: '0px' }}>
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
