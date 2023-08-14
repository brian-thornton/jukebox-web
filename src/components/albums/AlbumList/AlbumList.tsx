import { useLocation } from 'react-router-dom';
import { FC, useContext, useState, useEffect } from 'react';

import './AlbumList.scss';
import { applyLighting } from '../../../lib/lightingHelper';
import { getAlbums, searchAlbums } from '../../../lib/librarian-client';
import { SettingsContext } from '../../layout/SettingsProvider';
import Loading from '../../common/Loading/Loading';
import NoAlbumsLoaded from '../NoAlbumsLoaded/NoAlbumsLoaded';
import NoAlbumSearchResults from '../NoAlbumsSearchResults/NoAlbumsSearchResults';
import { usePageSize } from '../album-hooks';
import VerticalAlbumList from '../VerticalAlbumList/VerticalAlbumList';
import AlbumCoverList from '../AlbumCoverList/AlbumCoverList';

interface IAlbumList {
  selectedLibraries?: Array<string>,
  setStartsWithFilter?: Function,
  startsWithFilter?: string,
  display: string,
  search: string,
};

const AlbumList: FC<IAlbumList> = ({
  display, search, selectedLibraries, setStartsWithFilter, startsWithFilter,
}) => {
  const settings = useContext(SettingsContext);
  const { preferences, screen } = settings;
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [lastSearch, setLastSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const { state } = useLocation();
  const noResults = search && !albums.length && !isLoading;
  let category = state?.category;
  const { pathname } = window.location;
  const pageSize = screen?.isMobile ? 6 : usePageSize(display, settings);

  if (!category && pathname.includes('/categories')) {
    category = pathname.slice(window.location.pathname.lastIndexOf('/') + 1, pathname.length);
  }

  useEffect(() => {
    applyLighting(settings, 'Albums');
  }, []);

  const findAlbums = async (start: number, limit: number) => {
    searchAlbums(search, start, limit, startsWithFilter, preferences?.offlineLibraries).then((data) => {
      if (data.albums.length) {
        setTotalAlbums(data.totalAlbums);
        setAlbums(data.albums);
        if (search !== lastSearch) {
          setLastSearch(search);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    }).catch(() => {
      // Something went wrong. Let's try that again.
      setTimeout(() => findAlbums(start, limit), 3000);
    });
  };

  const loadAlbums = async () => {
    const start = selectedPage === 1 ? 0 : ((selectedPage * pageSize) - pageSize);
    const end = start + pageSize;

    if (selectedPage && pageSize) {
      setAlbums([]);
      if (search || startsWithFilter) {
        findAlbums(start, (start + pageSize));
      } else {
        const musicCategory = category === 'Albums' ? null : category;

        getAlbums(start, end, musicCategory, selectedLibraries, preferences?.restrictionGroup, null, preferences?.offlineLibraries)
          .then((data) => {
            setTotalAlbums(data.totalAlbums);
            setAlbums(data.albums);
            window.scrollTo(0, 0);
            setIsLoading(false);
            setLoadComplete(true);
          });
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadAlbums();
  }, [category, pageSize, selectedPage, selectedLibraries, search, startsWithFilter]);

  return (
    <>
      {loadComplete && totalAlbums === 0 && <NoAlbumsLoaded />}
      {noResults && <NoAlbumSearchResults />}
      {isLoading && <Loading text="Loading..." />}
      {!isLoading && !noResults && screen?.isMobile && (
        <VerticalAlbumList
          albums={albums}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      )}
      {!isLoading && !noResults && !screen?.isMobile && (
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
