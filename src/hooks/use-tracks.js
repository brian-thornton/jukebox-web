import { useEffect, useState } from 'react';
import { getTracks, searchTracks } from '../lib/service-clients/librarian-client';

export const useTracks = (selectedPage, realPageSize, search) => {
  const [tracks, setTracks] = useState([]);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  const [tracksLoaded, setTracksLoaded] = useState(false);

  const findTracks = async (start, limit) => {
    searchTracks(search, start, limit).then((data) => {
      setTotalTracks(data.totalTracks);
      setTracks(data.tracks);
      setTracksLoaded(true);
      setSearchInProgress(false);
    });
  };

  const loadTracks = () => {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    if (realStart >= 0 && realPageSize) {
      if (search) {
        findTracks(realStart, (realStart + realPageSize));
      } else {
        getTracks(realStart, (realStart + realPageSize)).then((data) => {
          setTotalTracks(data.totalTracks);
          setTracks(data.tracks);
          setTracksLoaded(true);
          setSearchInProgress(false);
        });
      }
    }
  };

  useEffect(() => {
    if (realPageSize > 0) {
      loadTracks();
    }
  }, [selectedPage, realPageSize, search]);

  return {
    totalTracks, tracks, tracksLoaded, searchInProgress
  };
};
