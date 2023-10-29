import { useEffect, useState } from 'react';
import { getStations } from '../lib/service-clients/radio-client';

export const useStations = (category, page, pageSize) => {
  const [stations, setStations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadStations = async (category, page, pageSize) => {
    const realStart = page === 1 ? 0 : ((page * pageSize) - pageSize);
    const data = await getStations(category, realStart, pageSize);
    setStations(data);
    setIsLoaded(true)
  };

  console.log(`page: ${page}, pageSize: ${pageSize}`);
  useEffect(() => {
    if (pageSize > 0) {
      loadStations(category, page, pageSize);
    }
  }, [category, page]);

  return { stations, isLoaded, loadStations }
};