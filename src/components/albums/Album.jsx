import React, { useEffect, useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { coverArtUrl } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import styles from '../styles';
import { Album as albumShape } from '../shapes';
import { SettingsContext } from '../layout/Jukebox';

const propTypes = {
  album: albumShape.isRequired,
  setCurrentAlbum: PropTypes.func.isRequired,
  coverArtOnly: PropTypes.bool,
};

function Album({
  album, setCurrentAlbum, coverArtOnly,
}) {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState(defaultCover);

  const loadCoverArt = () => {
    if (album.coverArtExists || settings.features.admin) {
      coverArtUrl(album).then((url) => setCoverArt(url));
    }
  };

  useEffect(() => loadCoverArt(), []);

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

  const body = () => {
    let body;
    if (!coverArtOnly) {
      body = (
        <Card.Body style={{ padding: '0px' }}>
          {albumName()}
        </Card.Body>
      );
    }

    return body;
  }

  return (
    <Card style={styles.albumCardStyle} className="h-55 w-85" onClick={() => setCurrentAlbum(album)}>
      <Card.Img style={styles.albumImage} top src={coverArt} />
      {body()}
    </Card>
  );
}

Album.propTypes = propTypes;

export default Album;
