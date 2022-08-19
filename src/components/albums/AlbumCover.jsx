import Card from 'react-bootstrap/Card';
import React, { useState, useEffect } from 'react';

import { coverArtUrl } from '../../lib/librarian-client';
import { Album } from '../shapes';
import './AlbumCover.scss';

const propTypes = {
  album: Album.isRequired,
};

const AlbumCover = ({ album }) => {
  const [coverArt, setCoverArt] = useState('');

  const loadCoverArt = () => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);
  return <Card.Img top src={coverArt} className="albumCover" />;
}

AlbumCover.propTypes = propTypes;

export default AlbumCover;
