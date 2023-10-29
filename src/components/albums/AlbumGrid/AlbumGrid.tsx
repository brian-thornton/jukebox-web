import Container from 'react-bootstrap/Container';
import { FC } from 'react';
import Row from 'react-bootstrap/Row';

import './AlbumGrid.scss';
import Album from '../Album/Album';
import FullWidthRow from '../../common/FullWidthRow/FullWidthRow';
import Paginator from '../../common/Paginator/Paginator';
import { IAlbum } from '../../interface';

interface IAlbumGrid {
  albums: Array<IAlbum>,
  setSelectedPage: Function,
  selectedPage: number,
  totalAlbums: number,
  pageSize: number,
  disableRandom: boolean,
}

const AlbumGrid: FC<IAlbumGrid> = ({
  albums, setSelectedPage, selectedPage, totalAlbums, pageSize, disableRandom,
}) => {
  const paginator = (
    <Paginator
      onPageChange={(page: any) => setSelectedPage(page)}
      selectedPage={selectedPage}
      totalItems={totalAlbums}
      pageSize={pageSize}
      disableRandom={disableRandom}
    />
  );

  return (
    <Container fluid className="albumListContainer">
      <FullWidthRow>
        {albums && albums?.length > 0 && (
          <Row className="albumRow">
            {albums.map(album => <Album album={album} coverArtOnly={false} />)}
          </Row>
        )}
      </FullWidthRow>
      <FullWidthRow>
        {paginator}
      </FullWidthRow>
    </Container>
  );
};

export default AlbumGrid;
