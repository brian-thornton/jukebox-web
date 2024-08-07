import { useState } from 'react';
import { useIntl } from 'react-intl';

import GenreAlbums from '../GenreAlbums/GenreAlbums';
import SideBySide from '../../layout/SideBySide/SideBySide';

const Genres = () => {
  const intl = useIntl();
  const [genre, setGenre] = useState<string>();

  const actions = [
    {
      text: intl.formatMessage({ id: 'rock' }),
      action: () => setGenre('rock')
    },
    {
      text: intl.formatMessage({ id: 'disco' }),
      action: () => setGenre('disco')
    },
    {
      text: intl.formatMessage({ id: 'pop' }),
      action: () => setGenre('pop')
    },
    {
      text: intl.formatMessage({ id: 'rap' }),
      action: () => setGenre('rap')
    },
    {
      text: intl.formatMessage({ id: 'dance' }),
      action: () => setGenre('dance')
    },
    {
      text: intl.formatMessage({ id: 'blues' }),
      action: () => setGenre('blues')
    },
    {
      text: intl.formatMessage({ id: 'country' }),
      action: () => setGenre('country')
    },
    {
      text: intl.formatMessage({ id: 'hiphop' }),
      action: () => setGenre('hiphop')
    },
    {
      text: intl.formatMessage({ id: 'jazz' }),
      action: () => setGenre('jazz')
    },
    {
      text: intl.formatMessage({ id: 'metal' }),
      action: () => setGenre('metal')
    },
    {
      text: intl.formatMessage({ id: 'punk' }),
      action: () => setGenre('punk')
    },
    {
      text: intl.formatMessage({ id: 'classicrock' }),
      action: () => setGenre('classicrock')
    },
  ];

  return genre ? (
    <GenreAlbums genre={genre} />
  ) : (
    <SideBySide data={actions} />
  );
};

export default Genres;
