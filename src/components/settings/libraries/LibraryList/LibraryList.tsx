import { FC, useContext, useState } from 'react';

import LibraryRow from '../LibraryRow/LibraryRow';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import { ILibrary } from '../../../interface';
import { SettingsContext } from '../../../layout/SettingsProvider';

interface ILibraryList {
  libraries: Array<ILibrary>,
  reloadLibraries: Function,
  setCurrentScan: Function,
  setSelectedLibrary: Function,
  showOnline: boolean,
}

const LibraryList: FC<ILibraryList> = ({
  libraries,
  reloadLibraries,
  setCurrentScan,
  setSelectedLibrary,
  showOnline,
}) => {
  const settings = useContext(SettingsContext);
  const { rowPageSize = 1 } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * rowPageSize) - rowPageSize);

  const items = (): JSX.Element[] => {
    let filteredLibraries = libraries;

    if (showOnline) {
      filteredLibraries = filteredLibraries.filter(library => library.enabled);
    }

    return filteredLibraries.slice(realStart, (realStart + rowPageSize)).map(library => (
      <LibraryRow
        library={library}
        reloadLibraries={reloadLibraries}
        setCurrentScan={setCurrentScan}
        setSelectedLibrary={setSelectedLibrary}
      />
    ))
  };

  return (
    <PaginatedList
      // @ts-ignore
      items={items()}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      pageSize={rowPageSize}
      totalItems={libraries.length}
      onItemClick={() => { }}
    />
  );
};

export default LibraryList;
