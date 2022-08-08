import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';

import Paginator from '../../common/Paginator';
import LibraryRow from './LibraryRow';

const LibraryList = ({ libraries, reloadLibraries, setCurrentScan }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  let totalTracks = 0;
  if (libraries?.length) {
    libraries.forEach((library) => {
      if (library.totalTracks) {
        totalTracks += library.totalTracks;
      }
    });
  }

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  return (
    <>
      <ListGroup>
        {libraries.slice(realStart, (realStart + realPageSize)).map((library) => (
          <LibraryRow library={library} reloadLibraries={reloadLibraries} setCurrentScan={setCurrentScan} />
        )
        )}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={(page) => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={libraries.length}
        pageSize={realPageSize}
      />
    </>
  );
}

export default LibraryList;
