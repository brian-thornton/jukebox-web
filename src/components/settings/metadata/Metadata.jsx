import React, { useEffect, useState } from 'react';

import { getArtistsByGenre, linkGenereToLibrary } from '../../../lib/metadata-client';
import Button from '../../Button';
import PaginatedList from '../../common/PaginatedList';
import Loading from '../../common/Loading';

const Metadata = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadGenre, setLoadGenre] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const genres = ['Rock', 'Disco', 'Pop', 'Rap', 'Dance', 'Blues', 'Country', 'Hip Hop', 'Jazz', 'Metal', 'Punk'];

  const loadData = (genre) => {
    setIsLoading(true);
    getArtistsByGenre(genre.toLowerCase()).then(() => {
      setIsLoading(false);
    })
  };

  const linkData = (genre) => {
    setIsLoading(true);
    linkGenereToLibrary(genre.toLowerCase()).then(() => {
      setIsLoading(false);
    })
  };

  const items = () => (
    genres.map(genre => (
      {
        text: genre,
        buttons: (
          <>
            <Button content="Get Data" onClick={() => loadData(genre.toLowerCase())} />
            <Button content="Link" onClick={() => linkData(genre.toLowerCase())} />
          </>
        ),
      }
    ))
  );

  return (
    <>
      {!isLoading && (
        <PaginatedList
          items={items()}
          totalItems={genres.length}
        />
      )}
      {isLoading && <Loading />}
    </>
  );
};

export default Metadata;
