import { useState } from 'react';
import { useIntl } from 'react-intl';

import Picker from '../common/Picker';
import GenreAlbums from './GenreAlbums';

const Genres = () => {
  const intl = useIntl();
  const [genre, setGenre] = useState();

  const genreItem = (genreName: any) => (
    {
      title: intl.formatMessage({id: genreName}),
      buttonText: intl.formatMessage({id: 'go_to'}, { name: genreName }),
      onClick: () => setGenre(genreName),
    }
  );

  return (
    <>
      {!genre && (
        <Picker
          applyPadding
          items={[
            genreItem('rock'),
            genreItem('disco'),
            genreItem('pop'),
            genreItem('rap'),
            genreItem('dance'),
            genreItem('blues'),
            genreItem('country'),
            genreItem('hiphop'),
            genreItem('jazz'),
            genreItem('metal'),
            genreItem('punk'),
            genreItem('celtic'),
            genreItem('classicrock'),
            genreItem('folk'),
            genreItem('jamband'),
            genreItem('raggae'),
          ]}
        />
      )}
      {genre && <GenreAlbums genre={genre} />}
    </>
  );
};

export default Genres;
