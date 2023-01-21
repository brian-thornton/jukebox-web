import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Picker from '../common/Picker';
import GenreAlbums from './GenreAlbums';

const Genres = () => {
  const [genre, setGenre] = useState();

  const genreItem = (genre) => (
    {
      title: <FormattedMessage id={genre} />,
      buttonText: <FormattedMessage id="go_to" values={{ name: genre }} />,
      onClick: () => setGenre(genre),
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
  )
};

export default Genres;
