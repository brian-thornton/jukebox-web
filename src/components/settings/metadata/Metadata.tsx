import { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';

import { getArtistsByGenre, linkGenereToLibrary } from '../../../lib/metadata-client';
import Button from '../../Button';
import PaginatedList from '../../common/PaginatedList';
import Loading from '../../common/Loading';
import { calculatePageSize } from '../../../lib/styleHelper';

const Metadata = () => {
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);
  useEffect(() => setItemsPerPage(calculatePageSize('item', 250, 60)), []);

  const genres = ['Rock', 'Disco', 'Pop', 'Rap', 'Dance', 'Blues', 'Country', 'Hip Hop', 'Jazz',
    'Metal', 'Punk', 'Celtic', 'Classic Rock', 'Folk', 'Jam Band', 'Raggae'];

  const loadData = (genre: string) => {
    setIsLoading(true);
    getArtistsByGenre(genre.toLowerCase()).then(() => {
      linkGenereToLibrary(genre.toLowerCase()).then(() => {
        setIsLoading(false);
      });
    });
  };

  const items = () => (
    genres.slice(realStart, (realStart + itemsPerPage)).map(genre => (
      {
        text: genre,
        buttons: <Button content="Get Data" onClick={() => loadData(genre.toLowerCase())} />,
      }
    ))
  );

  return (
    <>
      {!isLoading && (
        <PaginatedList
          // @ts-ignore
          items={items()}
          totalItems={genres.length}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={itemsPerPage}
        />
      )}
      {isLoading && <Loading text="Loading..." />}
    </>
  );
};

export default injectIntl(Metadata);
