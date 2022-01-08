import React, { useEffect, useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { Album as albumShape } from '../shapes';
import { coverArtUrl, saveCoverArt } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from '../styles';

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
      coverArtUrl(album).then((data) => {
        setCoverArt(data.url)

        if (!data.isLocal && !data.isDefault) {
          saveCoverArt({ album, url: data.url });
        }
      });
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
    if (!coverArtOnly) {
      return (
        <Card.Body style={{ padding: '0px', fontFamily: settings.styles.listFont }}>
          {albumName()}
        </Card.Body>
      );
    }

    return <React.Fragment />;
  };

  return (
    <Card style={styles.albumCardStyle} className="h-55 w-85" onClick={() => setCurrentAlbum(album)}>
      <Card.Img style={styles.albumImage} top src={coverArt} />
      {body()}
    </Card>
  );
}

Album.defaultProps = {
  coverArtOnly: false,
};

Album.propTypes = propTypes;

export default Album;
