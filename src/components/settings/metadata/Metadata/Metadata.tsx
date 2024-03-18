import { useContext, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';

import { getArtistsByGenre, linkGenereToLibrary } from '../../../../lib/service-clients/metadata-client';
import Button from '../../../common/Buttons/Button/Button';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import Loading from '../../../common/Loading/Loading';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
import { SettingsContext } from '../../../layout/SettingsProvider';

const Metadata = () => {
  const settings = useContext(SettingsContext);
  const { screen } = settings;
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);
  useEffect(() => {
    if (screen?.isMobile) {
      setItemsPerPage(11);
    } else {
      setItemsPerPage(calculatePageSize('item', 250, 60));
    }
  }, []);

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

  return isLoading ? <Loading text="Loading..." /> : (
    <PaginatedList
      items={items()}
      totalItems={genres.length}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      pageSize={itemsPerPage}
      onItemClick={() => { }}
    />
  );
};

export default injectIntl(Metadata);
