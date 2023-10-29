import { useEffect, useState } from 'react';
import { getLibraries } from '../lib/service-clients/librarian-client';
import { getStatus, updateStatus } from '../lib/service-clients/status-client';

export const useLibraries = (settings) => {
  const [libraries, setLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateTotals = (data) => {
    let totalTracks = 0;
    let totalAlbums = 0;

    const categoryAlbums = {};
    settings.categories.map(c => categoryAlbums[c] = 0);

    if (data) {
      data.forEach((lib) => {
        if (lib.category && lib.albums?.length) {
          categoryAlbums[lib.category] += lib.albums.length;
        } else {
          if (lib?.albums?.length) {
            totalTracks += lib?.totalTracks;
            totalAlbums += lib?.albums?.length;
          }
        }
      });
      getStatus().then((response) => {
        updateStatus({
          ...response,
          totalTracks,
          totalAlbums,
          categoryAlbums,
        });
      });
    }
  };

  const loadLibraries = () => {
    setIsLoading(true);
    getLibraries().then((data) => {
      setLibraries(data);
      updateTotals(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadLibraries();
  }, []);

  return { libraries, isLoading, loadLibraries }
};