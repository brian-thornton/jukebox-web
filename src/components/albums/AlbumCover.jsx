import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

import { getCoverArt } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import { Album } from '../shapes';

const albumArt = require('album-art');

const propTypes = {
  album: Album.isRequired,
};

function AlbumCover({ album }) {
  const [coverArt, setCoverArt] = useState('');

  const getAlbumCoverArt = () => {
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
    getCoverArt(album.path).then((image) => {
      let src;
      if (album.id) {
        src = album.images[1].url;
      } else if (image.type === 'image/jpeg') {
        src = URL.createObjectURL(image);
      } else {
        getAlbumCoverArt();
      }
      setCoverArt(src);
    });
  };

  useEffect(() => loadCoverArt(), []);

  return (
    <Card.Img top src={coverArt} />
  );
};


AlbumCover.propTypes = propTypes;

export default AlbumCover;
