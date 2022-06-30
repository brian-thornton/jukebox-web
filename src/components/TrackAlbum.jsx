import Card from 'react-bootstrap/Card';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Album as albumShape } from './shapes';
import { coverArtUrl } from '../lib/librarian-client';
import styles from './TrackAlbum.module.css';

const propTypes = {
  album: albumShape.isRequired,
};

const TrackAlbum = ({ album }) => {
  const navigate = useNavigate();
  const [coverArt, setCoverArt] = useState();

  const loadCoverArt = () => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);

  return (
    <>
      {coverArt && (
        <Card
          className={styles.trackAlbumCard}
          onClick={() => navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } })}
        >
          <Card.Img top src={coverArt} />
        </Card>
      )}
    </>
  );
}

TrackAlbum.propTypes = propTypes;

export default TrackAlbum;
