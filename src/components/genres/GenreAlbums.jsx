import React, { useContext, useEffect, useState } from 'react';

import './GenreAlbums.scss';
import { getAlbums } from '../../lib/librarian-client';
import { headerFooterReserve } from '../../lib/styleHelper';
import { SettingsContext } from '../layout/SettingsProvider';
import Loading from '../common/Loading';
import AlbumGrid from '../albums/AlbumGrid';
import { coverDimensions } from '../../lib/styleHelper';

const GenreAlbums = ({ genre }) => {
  const settings = useContext(SettingsContext);
  const [genreAlbums, setGenreAlbums] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState();
  const [totalAlbums, setTotalAlbums] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const reserve = headerFooterReserve(settings);
    const dimensions = coverDimensions(settings);
    const albumsPerRow = Math.floor(window.innerWidth / (dimensions.coverWidth));
    const numberOfRows = Math.floor((window.innerHeight - reserve) / dimensions.coverHeight);
    setPageSize(albumsPerRow * numberOfRows);
  }, []);

  const loadGenreAlbums = () => {
    const start = selectedPage === 1 ? 0 : ((selectedPage * pageSize) - pageSize);
    const end = start + pageSize;

    getAlbums(start, end, null, null, settings.preferences.restrictionGroup, genre)
      .then((data) => {
        setTotalAlbums(data.totalAlbums);
        setGenreAlbums(data.albums);
        window.scrollTo(0, 0);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (selectedPage && pageSize) {
      setIsLoading(true);
      loadGenreAlbums();
    }
  }, [selectedPage, pageSize]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && genreAlbums?.length > 0 && (
        <AlbumGrid
          albums={genreAlbums}
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
          totalAlbums={totalAlbums}
          pageSize={pageSize}
          disableRandom={true}
        />
      )}
    </>
  );
};

export default GenreAlbums;

