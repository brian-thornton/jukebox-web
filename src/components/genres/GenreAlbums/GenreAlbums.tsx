import { FC, useContext, useEffect, useState } from 'react';

import { getAlbums } from '../../../lib/service-clients/librarian-client';
import { coverDimensions, headerFooterReserve } from '../../../lib/helper/styleHelper';
import { SettingsContext } from '../../layout/SettingsProvider';
import Loading from '../../common/Loading/Loading';
import AlbumGrid from '../../albums/AlbumGrid/AlbumGrid';
import NoResults from '../../common/NoResults/NoResults';

interface IGenreAlbums {
  genre: string,
}

const GenreAlbums: FC<IGenreAlbums> = ({ genre }) => {
  const settings = useContext(SettingsContext);
  const [genreAlbums, setGenreAlbums] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [totalAlbums, setTotalAlbums] = useState(0);
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

    getAlbums(start, end, null, null, settings?.preferences?.restrictionGroup, genre)
      .then((data) => {
        setTotalAlbums(data.totalAlbums);
        setGenreAlbums(data.albums);
        window.scrollTo(0, 0);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (selectedPage && pageSize) {
      setIsLoading(true);
      loadGenreAlbums();
    }
  }, [selectedPage, pageSize]);

  return (
    <>
      {isLoading && <Loading text="Loading" />}
      {!isLoading && genreAlbums.length > 0 && (
        <AlbumGrid
          albums={genreAlbums}
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
          totalAlbums={totalAlbums}
          pageSize={pageSize}
          disableRandom={true}
        />
      )}
      {!isLoading && genreAlbums.length === 0 && (
        <NoResults
          title={"No Albums Found"}
          text={"No music found matching the selected genre."}
        />
      )}
    </>
  );
};

export default GenreAlbums;
