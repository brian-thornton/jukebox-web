import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { Album as albumShape } from './shapes';
import defaultCover from './albums/default_album.jpg';
import { getCoverArt } from '../lib/librarian-client';
import styles from './styles';
import { SettingsContext } from './layout/Jukebox';
import './TrackAlbum.css';

const propTypes = {
  album: albumShape.isRequired,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function TrackAlbum({ album, setCurrentAlbum }) {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState(defaultCover);

  const loadCoverArt = () => {
    if (album.coverArtExists || settings.features.admin) {
      getCoverArt(album.path).then((image) => {
        const src = image.type === 'image/jpeg' ? URL.createObjectURL(image) : defaultCover;
        setCoverArt(src);
      });
    }
  };

  useEffect(() => loadCoverArt(), []);

  return (
    <Card style={styles.albumCardStyleSmall} className="album-card-small" onClick={() => setCurrentAlbum(album)}>
      <Card.Img top src={coverArt} />
    </Card>
  );
}

TrackAlbum.propTypes = propTypes;

export default TrackAlbum;
