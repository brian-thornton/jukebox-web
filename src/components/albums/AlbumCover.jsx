import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

import { coverArtUrl } from '../../lib/librarian-client';
import { Album } from '../shapes';
import styles from './AlbumCover.module.css';

const propTypes = {
  album: Album.isRequired,
};

function AlbumCover({ album }) {
  const [coverArt, setCoverArt] = useState('');

  const loadCoverArt = () => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);
  return <Card.Img top src={coverArt} className={styles.albumCover} />;
}

AlbumCover.propTypes = propTypes;

export default AlbumCover;
