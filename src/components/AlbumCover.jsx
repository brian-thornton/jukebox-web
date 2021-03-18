import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

import LibrianClient from '../lib/librarian-client';
import defaultCover from '../default_album.jpg';
import { Album } from './shapes';

const albumArt = require('album-art');

const propTypes = {
  album: Album.isRequired,
};

function AlbumCover({ album }) {
  const [coverArt, setCoverArt] = useState('');
  const [isCoverArtLoaded, setIsCoverArtLoaded] = useState(false);
  const [isCoverArtLoading, setIsCoverArtLoading] = useState(false);

  const getCoverArt = () => {
    const nameArray = album.name.split('-');

    albumArt(nameArray[0], { album: nameArray[1] }).then((data) => {
      if (data.toString().includes('http')) {
        setCoverArt(data);
      } else {
        setCoverArt(defaultCover);
      }
    });
  };

  const loadCoverArt = () => {
    if (!isCoverArtLoading) {
      setIsCoverArtLoading(true);
      LibrianClient.getCoverArt(album.path).then((image) => {
        let src;
        if (album.id) {
          src = album.images[1].url;
        } else if (image.type === 'image/jpeg') {
          src = URL.createObjectURL(image);
        } else {
          getCoverArt();
        }
        setIsCoverArtLoading(false);
        setIsCoverArtLoaded(true);
        setCoverArt(src);
      });
    }
  };


  if (!isCoverArtLoaded) {
    loadCoverArt();
  }

  return (
    <Card.Img top src={coverArt} />
  );
};


AlbumCover.propTypes = propTypes;

export default AlbumCover;
