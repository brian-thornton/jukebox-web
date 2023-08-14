import { useSwipeable } from 'react-swipeable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import './AlbumCoverList.scss';
import { handlers } from '../../../lib/gesture-helper';
import { SettingsContext } from '../../layout/SettingsProvider';
import Album from '../Album/Album';
import AlbumTable from '../AlbumTable/AlbumTable';
import FullWidthRow from '../../common/FullWidthRow/FullWidthRow';
import Paginator from '../../common/Paginator/Paginator';
import StartsWithFilter from '../StartsWithFilter/StartsWithFilter';
import { usePageSize } from '../album-hooks';
import { IAlbum } from '../../interface';

interface IAlbumCoverList {
  setStartsWithFilter?: Function,
  startsWithFilter?: string,
  display: string,
  search: string,
  albums: Array<IAlbum>,
  totalAlbums: number,
  selectedPage: number,
  setSelectedPage: Function,
};

const AlbumCoverList: FC<IAlbumCoverList> = ({
  albums, display, search, totalAlbums, setStartsWithFilter, startsWithFilter, selectedPage, setSelectedPage,
}) => {
  const settings = useContext(SettingsContext);
  const { preferences, screen } = settings;
  const { startsWithLocation } = preferences || {};
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const cols = startsWithLocation === 'none' ? '12' : '11';
  const pageSize = screen?.isMobile ? 6 : usePageSize(display, settings);

  console.log(selectedPage);
  console.log(totalAlbums);
  console.log(pageSize)

  const paginator = (
    <Paginator
      onPageChange={(page: any) => setSelectedPage(page)}
      selectedPage={selectedPage}
      totalItems={totalAlbums}
      pageSize={pageSize}
      disableRandom={search?.length > 0 || display !== 'covers'}
    />
  );

  const startsWithCol = (
    <Col lg="1" xl="1" md="1" sm="1">
      <StartsWithFilter
        startsWithFilter={startsWithFilter}
        setStartsWithFilter={setStartsWithFilter}
      />
    </Col>
  );

  return (
    <Container {...swipe} fluid className="albumListContainer">
      <Row className="containerRow">
        <>
          {startsWithLocation === 'left' && !screen?.isTabletOrSmaller && !search && startsWithCol}
          <Col lg={cols} xl={cols} md={cols} sm={cols} className="centerCol">
            {display !== 'grid' && (
              <Container fluid>
                <Row className="albumRow">
                  {albums.map(album => <Album album={album} coverArtOnly={false} />)}
                </Row>
                <Row className="albumRow">
                  {(totalAlbums > pageSize) && startsWithLocation !== 'none' && !search && !screen?.isTabletOrSmaller && paginator}
                </Row>
              </Container>
            )}
            {display === 'grid' && <AlbumTable albums={albums} />}
          </Col>
          {startsWithLocation === 'right' && !screen?.isTabletOrSmaller && !search && startsWithCol}
        </>
      </Row>
      {(startsWithLocation === 'none' || search) && (
        <FullWidthRow>
          {(totalAlbums > pageSize) && !screen?.isTabletOrSmaller && paginator}
        </FullWidthRow>
      )}
    </Container>
  );
};

export default AlbumCoverList;
