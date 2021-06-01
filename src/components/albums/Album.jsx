import React, { useState, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { getCoverArt } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import styles from '../styles';
import { Album as albumShape } from '../shapes';
import { SettingsContext } from '../layout/Jukebox';

import './Album.css';

const propTypes = {
  album: albumShape.isRequired,
  cover: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
  coverArtOnly: PropTypes.bool,
};

function Album({
  album, cover, setCurrentAlbum, coverArtOnly,
}) {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState(defaultCover);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadCoverArt = () => {
    if (album.coverArtExists || settings.features.admin) {
      getCoverArt(album.path).then((image) => {
        let src;

        if (cover) {
          src = cover;
        } else if (image.type === 'image/jpeg') {
          src = URL.createObjectURL(image);
        } else {
          src = defaultCover;
        }
        setCoverArt(src);
      });
    }
    setIsLoaded(true);
  };

  const albumName = () => {
    if (settings.preferences.showAlbumName) {
      return (
        <Card.Title style={{ ...styles.albumTitle, color: settings.styles.fontColor }}>
          {album.name}
        </Card.Title>
      );
    }

    return <React.Fragment />;
  };

  const largeAlbum = () => {
    if (!settings.preferences.showAlbumsWithoutCoverArt && coverArt === defaultCover) {
      return <React.Fragment />;
    }

    if (coverArtOnly) {
      return (
        <Card className="h-55 w-85 album-card-small" onClick={() => setCurrentAlbum(album)}>
          <Card.Img style={styles.albumImageSmall} top src={coverArt} />
        </Card>
      );
    }

    return (
      <Card style={styles.albumCardStyle} className="h-55 w-85" onClick={() => setCurrentAlbum(album)}>
        <Card.Img style={styles.albumImage} top src={coverArt} />
        <Card.Body style={{ padding: '0px' }}>
          {albumName()}
        </Card.Body>
      </Card>
    );
  };

  if (!isLoaded) {
    loadCoverArt();
  }

  return largeAlbum();
}

Album.propTypes = propTypes;

export default Album;
