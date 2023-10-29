import { useEffect, useState } from "react";

import {
  getQueue,
} from '../lib/service-clients/queue-client'

export const useQueue = (selectedPage, itemsPerPage) => {
  const [tracks, setTracks] = useState([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const loadQueue = () => {
    const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);
  
    getQueue(start, (start + itemsPerPage)).then((data) => {
      setTracks(data.tracks);
      setTotalTracks(data.totalTracks);
      if (data.tracks.length === 0) {
        setIsEmpty(true);
      }
    });
  };

  useEffect(() => {
    if (itemsPerPage > 0) {
      loadQueue(itemsPerPage);
    }
  }, [selectedPage, itemsPerPage]);

  return { tracks, totalTracks, isEmpty, isLoaded, loadQueue }
};

