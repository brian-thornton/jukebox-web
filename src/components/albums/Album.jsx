import React, { useEffect, useContext, useState } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
    <Card className={styles.albumCard} onClick={() => navigate(`/albums/${album.id}`, { state: { currentAlbum: album } })}>
      <Card.Img style={{ height: '200px', maxHeight: '200px', width: '200px', maxWidth: '200px' }} top src={coverArt} />
      {body()}
    </Card>
  );
}

Album.defaultProps = {
  coverArtOnly: false,
};

Album.propTypes = propTypes;

export default Album;
