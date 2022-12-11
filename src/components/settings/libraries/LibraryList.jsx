import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';

import LibraryRow from './LibraryRow';
import { pageSize } from '../../../lib/styleHelper';
import PaginatedList from '../../common/PaginatedList';
import { Libraries } from '../../shapes';

const propTypes = {
  libraries: Libraries.isRequired,
  reloadLibraries: PropTypes.func.isRequired,
  setCurrentScan: PropTypes.func.isRequired,
  setSelectedLibrary: PropTypes.func.isRequired,
};

const LibraryList = ({
  libraries,
  reloadLibraries,
  setCurrentScan,
  setSelectedLibrary,
}) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  useEffect(() => setRealPageSize(pageSize('item', 300)), []);

  const items = () => (
    libraries.slice(realStart, (realStart + realPageSize)).map(library => (
      <LibraryRow
        library={library}
        reloadLibraries={reloadLibraries}
        setCurrentScan={setCurrentScan}
        setSelectedLibrary={setSelectedLibrary}
      />
    ))
  );

  return (
    <PaginatedList
      items={items()}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      pageSize={realPageSize}
      totalItems={libraries.length}
    />
  );
};

LibraryList.propTypes = propTypes;

export default LibraryList;
