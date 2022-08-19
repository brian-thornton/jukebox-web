import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';

import Paginator from '../../common/Paginator';
import LibraryRow from './LibraryRow';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../../lib/gesture-helper';

const LibraryList = ({ libraries, reloadLibraries, setCurrentScan }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  return (
    <>
      <ListGroup {...swipe}>
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
