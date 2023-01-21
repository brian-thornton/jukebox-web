import Container from "react-bootstrap/Container";
import React from "react";
import Row from "react-bootstrap/Row";

import './AlbumGrid.scss';
import Album from "./Album";
import FullWidthRow from "../common/FullWidthRow";
import Paginator from "../common/Paginator";

const AlbumGrid = ({ albums, setSelectedPage, selectedPage, totalAlbums, pageSize, disableRandom }) => {
  const paginator = (
    <Paginator
      onPageChange={(page) => setSelectedPage(page)}
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

export default AlbumGrid;
