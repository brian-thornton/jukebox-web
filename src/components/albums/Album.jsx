import Card from 'react-bootstrap/Card';
import { PropTypes } from 'prop-types';
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Album as albumShape } from '../shapes';
import { coverArtUrl, saveCoverArt } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './Album.module.css';

const propTypes = {
  album: albumShape.isRequired,
  coverArtOnly: PropTypes.bool,
};

const Album = ({ album, coverArtOnly }) => {
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

  const albumNameStyle = {
    color: settings.styles.fontColor,
    fontFamily: settings.styles.buttonFont,
  };

  return (
    <Card className={styles.albumCard} onClick={() => navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } })}>
      <Card.Img className={styles.albumImage} top src={coverArt} />
      {!coverArtOnly && (
        <Card.Body className={styles.albumCardBody} style={albumNameStyle}>
          {settings.preferences.showAlbumName && album.name}
        </Card.Body>
      )}
    </Card>
  );
}

Album.defaultProps = {
  coverArtOnly: false,
};

Album.propTypes = propTypes;

export default Album;
