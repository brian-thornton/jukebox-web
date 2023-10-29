import { useEffect, useState } from 'react';
import { getPlaylists } from '../lib/service-clients/playlist-client';

export const usePlaylists = (selectedPage, pageSize) => {
  const [playlists, setPlaylists] = useState([]);
  const [totalPlaylists, setTotalPlaylists] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);

  const loadPlaylists = () => {
    const start = selectedPage === 1 ? 0 : ((selectedPage * pageSize) - pageSize);

    getPlaylists(start, (start + pageSize)).then((data) => {
      setPlaylists(data.playlists);
      setTotalPlaylists(data.totalPlaylists);
      setIsEmpty(data.playlists.length === 0);
    });
  };

  useEffect(() => {
    if (pageSize > 0) {
      loadPlaylists();
    }
  }, [selectedPage, pageSize]);

  return {
    playlists, totalPlaylists, isEmpty
  }
};
