import Card from 'react-bootstrap/Card';
import React, { useContext, useState, useEffect } from 'react';

import { coverArtUrl } from '../../lib/librarian-client';
import { Album } from '../shapes';
import './AlbumCover.scss';
import { SettingsContext } from '../layout/SettingsProvider'; 

const propTypes = {
  album: Album.isRequired,
};

const AlbumCover = ({ album }) => {
  const [coverArt, setCoverArt] = useState('');
  const settings = useContext(SettingsContext);

  const loadCoverArt = () => {
    coverArtUrl(album, settings.styles.defaultAlbumCover).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);
  return <Card.Img top src={coverArt} className="albumCover" />;
}

AlbumCover.propTypes = propTypes;

export default AlbumCover;
