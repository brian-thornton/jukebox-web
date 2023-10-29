
import { useState, useEffect } from 'react';

import { getAlbums, searchAlbums } from '../lib/service-clients/librarian-client';

export function useAlbums(selectedPage, pageSize, category, selectedLibraries, search, startsWithFilter, preferences) {
  const [albums, setAlbums] = useState([]);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadComplete, setLoadComplete] = useState(false);

  const findAlbums = async (start, limit) => {
    searchAlbums(search, start, limit, startsWithFilter, preferences?.offlineLibraries).then((data) => {
      if (data.albums.length) {
        setTotalAlbums(data.totalAlbums);
        setAlbums(data.albums);
        console.log(data);
        if (search !== lastSearch) {
          setLastSearch(search);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
      setLoadComplete(true);
    }).catch(() => {
      // Something went wrong. Let's try that again.
      setTimeout(() => findAlbums(start, limit), 3000);
    });
  };

  useEffect(() => {
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
  }, [selectedPage, pageSize, category, selectedLibraries, search, startsWithFilter, preferences]);

  return {
    albums, totalAlbums, isLoading, loadComplete,
  };
}