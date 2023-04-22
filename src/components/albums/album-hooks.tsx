import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

import { ISettings } from "../interface";
import { headerFooterReserve } from "../../lib/styleHelper";
import { coverDimensions } from "../../lib/styleHelper";

export const usePageSize = (display: string, settings: ISettings) => {
  const [pageSize, setPageSize] = useState(0);
  const { state } = useLocation();
  let category = state?.category;
  const { pathname } = window.location;

  if (!category && pathname.includes('/categories')) {
    category = pathname.slice(window.location.pathname.lastIndexOf('/') + 1, pathname.length);
  }

  useEffect(() => {
    if (display !== 'covers' && !category) {
      const itemsPerColumn = Math.floor((window.innerHeight - 200) / 60);
      setPageSize(itemsPerColumn * 3);
    } else {
      const reserve = headerFooterReserve(settings);
      const startsWithReserve = ['left', 'right'].includes(settings?.preferences?.startsWithLocation || '') ? 25 : 0;
      const dimensions = coverDimensions(settings);
      const { coverWidth, coverHeight } = dimensions;
      const albumsPerRow = Math.floor(window.innerWidth / (coverWidth + startsWithReserve));
      const numberOfRows = Math.floor((window.innerHeight - reserve) / (display === 'grid' ? 65 : coverHeight));
      setPageSize(albumsPerRow * numberOfRows);
    }
  }, [display]);
  return pageSize;
};