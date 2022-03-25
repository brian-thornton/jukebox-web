import React, { useEffect, useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { Album as albumShape } from '../shapes';
import { coverArtUrl, saveCoverArt } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './Album.module.css';

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
      return album.name;
    }

    return <></>;
  };

  const albumNameStyle = {
    color: settings.styles.fontColor,
    fontFamily: settings.styles.buttonFont,
  };

  const body = () => {
    if (!coverArtOnly) {
      return (
        <Card.Body className={styles.albumCardBody} style={albumNameStyle}>
          {albumName()}
        </Card.Body>
      );
    }

    return <></>;
  };

  return (
    <Card className={styles.albumCard} onClick={() => setCurrentAlbum(album)}>
      <Card.Img top src={coverArt} />
      {body()}
    </Card>
  );
}

Album.defaultProps = {
  coverArtOnly: false,
};

Album.propTypes = propTypes;

export default Album;
