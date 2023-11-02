import { useLocation } from 'react-router-dom';
import { FC, useContext, useState, useEffect } from 'react';

import { applyLighting } from '../../../lib/helper/lightingHelper';
import { SettingsContext } from '../../layout/SettingsProvider';
import Loading from '../../common/Loading/Loading';
import NoAlbumsLoaded from '../NoAlbumsLoaded/NoAlbumsLoaded';
import NoAlbumSearchResults from '../NoAlbumsSearchResults/NoAlbumsSearchResults';
import { usePageSize } from '../album-hooks';
import VerticalAlbumList from '../VerticalAlbumList/VerticalAlbumList';
import AlbumCoverList from '../AlbumCoverList/AlbumCoverList';
import { useAlbums } from '../../../hooks/use-albums';

interface IAlbumList {
  selectedLibraries?: Array<string>,
  setStartsWithFilter?: Function,
  startsWithFilter?: string,
  display: string,
  search: string,
}

const AlbumList: FC<IAlbumList> = ({
  display, search, selectedLibraries, setStartsWithFilter, startsWithFilter,
}) => {
  const settings = useContext(SettingsContext);
  const { preferences, screen } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const { state } = useLocation();
  let category = state?.category;
  const { pathname } = window.location;
  const pageSize = screen?.isMobile ? 6 : usePageSize(display, settings);
  
  const { albums, totalAlbums, isLoading, loadComplete } = useAlbums(selectedPage, pageSize, category, selectedLibraries, search, startsWithFilter, preferences);
  
  const noResults = search && !albums.length && !isLoading;
  
  if (!category && pathname.includes('/categories')) {
    category = pathname.slice(window.location.pathname.lastIndexOf('/') + 1, pathname.length);
  }

  useEffect(() => {
    applyLighting(settings, 'Albums');
  }, []);

  return (
    <>
      {loadComplete && totalAlbums === 0 && <NoAlbumsLoaded />}
      {noResults && <NoAlbumSearchResults />}
      {/* {isLoading && <Loading text="Loading..." />} */}
      {!isLoading && !noResults && screen?.isMobile && (
        <VerticalAlbumList
          albums={albums}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      )}
      {!screen?.isMobile && (
        <AlbumCoverList
          setStartsWithFilter={setStartsWithFilter}
          startsWithFilter={startsWithFilter}
          display={display}
          search={search}
          albums={albums}
          totalAlbums={totalAlbums}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />)}
    </>
  );
};

export default AlbumList;
