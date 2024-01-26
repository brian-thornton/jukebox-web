import { FC, useContext, useEffect, useState } from 'react';

import LibraryRow from '../LibraryRow/LibraryRow';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
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
  const { screen } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(0);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  
  useEffect(() => {
    if (screen?.isMobile) {
      setRealPageSize(12);
    } else {
      setRealPageSize(calculatePageSize('item', 300));
    }
  }, []);

  const items = (): JSX.Element[] => {
    let filteredLibraries = libraries;

    if (showOnline) {
      filteredLibraries = filteredLibraries.filter(library => library.enabled);
    }

    return filteredLibraries.slice(realStart, (realStart + realPageSize)).map(library => (
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
      pageSize={realPageSize}
      totalItems={libraries.length}
      onItemClick={() => { }}
    />
  );
};

export default LibraryList;
