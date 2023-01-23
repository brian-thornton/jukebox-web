import Container from 'react-bootstrap/Container';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { PropTypes } from 'prop-types';

import './AlbumGrid.scss';
import Album from './Album';
import FullWidthRow from '../common/FullWidthRow';
import Paginator from '../common/Paginator';
import { Albums } from '../shapes';

const propTypes = {
  albums: Albums.isRequired,
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired,
  totalAlbums: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  disableRandom: PropTypes.bool,
};

const AlbumGrid = ({
  albums, setSelectedPage, selectedPage, totalAlbums, pageSize, disableRandom,
}) => {
  const paginator = (
    <Paginator
      onPageChange={page => setSelectedPage(page)}
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
            {albums.map(album => <Album album={album} />)}
          </Row>
        )}
      </FullWidthRow>
      <FullWidthRow>
        {paginator}
      </FullWidthRow>
    </Container>
  );
};

AlbumGrid.propTypes = propTypes;

AlbumGrid.defaultProps = {
  disableRandom: false,
};

export default AlbumGrid;
