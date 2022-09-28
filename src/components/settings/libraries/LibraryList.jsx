import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';

import Paginator from '../../common/Paginator';
import LibraryRow from './LibraryRow';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../../lib/gesture-helper';
import { pageSize } from '../../../lib/styleHelper';

const LibraryList = ({ libraries, reloadLibraries, setCurrentScan, setSelectedLibrary }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  useEffect(() => setRealPageSize(pageSize('item', 300)), []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  return (
    <>
      <ListGroup {...swipe}>
        {libraries.slice(realStart, (realStart + realPageSize)).map((library) => (
          <LibraryRow library={library} reloadLibraries={reloadLibraries} setCurrentScan={setCurrentScan} setSelectedLibrary={setSelectedLibrary} />
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
