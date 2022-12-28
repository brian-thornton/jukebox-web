import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import React, { useEffect, useContext, useState } from 'react';

import './Album.scss';
import { Album as albumShape } from '../shapes';
import { coverArtUrl, saveCoverArt } from '../../lib/librarian-client';
import { SettingsContext } from '../layout/SettingsProvider';
import defaultCover from './default_album.jpg';

const propTypes = {
  album: albumShape.isRequired,
  coverArtOnly: PropTypes.bool,
};

const Album = ({ album, coverArtOnly }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const { coverSize } = settings.preferences;
  const [coverArt, setCoverArt] = useState(defaultCover);

  const loadCoverArt = () => {
    if (album.coverArtExists || settings.features.admin) {
      coverArtUrl(album, settings.styles.defaultAlbumCover).then((data) => {
        setCoverArt(data.url);

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

  const albumImageStyle = {
    width: coverSize === 'medium' ? '300px' : '200px',
    height: coverSize === 'medium' ? '300px' : '200px',
    maxWidth: coverSize === 'medium' ? '300px' : '200px',
    maxHeight: coverSize === 'medium' ? '300px' : '200px',
  };

  const albumCardStyle = {
    width: coverSize === 'medium' ? '303px' : '203px',
    height: coverSize === 'medium' ? '320px' : '220px',
    maxWidth: coverSize === 'medium' ? '303px' : '203px',
    maxHeight: coverSize === 'medium' ? '320px' : '220px',
  };

  if (coverSize === 'large') {
    albumImageStyle.width = '400px';
    albumImageStyle.height = '400px';
    albumImageStyle.maxWidth = '400px';
    albumImageStyle.maxHeight = '400px';
    albumCardStyle.width = '400px';
    albumCardStyle.height = '420px';
    albumCardStyle.maxWidth = '400px';
    albumCardStyle.maxHeight = '420px';
  }

  return (
    <Card
      className="albumCard"
      style={albumCardStyle}
      onClick={() => {
        if (!settings.features.isLocked) {
          navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
        }
      }}
    >
      <Card.Img top src={coverArt} style={albumImageStyle} />
      {!coverArtOnly && (
        <Card.Body className="albumCardBody" style={albumNameStyle}>
          {settings.preferences.showAlbumName && album.name}
        </Card.Body>
      )}
    </Card>
  );
};

Album.defaultProps = {
  coverArtOnly: false,
};

Album.propTypes = propTypes;

export default Album;
