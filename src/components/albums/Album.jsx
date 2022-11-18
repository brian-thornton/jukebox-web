import Card from 'react-bootstrap/Card';
import { PropTypes } from 'prop-types';
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Album as albumShape } from '../shapes';
import { coverArtUrl, saveCoverArt } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import { SettingsContext } from '../layout/SettingsProvider';
import './Album.scss';

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
        setCoverArt(data.url)

        if (!data.isLocal && !data.isDefault) {
          saveCoverArt({ album, url: data.url });
        }i
      });
    }
  };

  useEffect(() => loadCoverArt(), []);

  const albumNameStyle = {
    color: settings.styles.fontColor,
    fontFamily: settings.styles.buttonFont,
  };

  const albumImageStyle = {
    width: '200px',
    height: '300px',
    maxWidth: '200px',
    maxHeight: '300px',
  };

  const albumCardStyle = {
    width: '200px',
    height: '300px',
    maxWidth: '200px',
    maxHeight: '300px',
  }

  if (coverSize === 'small') {
    albumImageStyle.width = '200px';
    albumImageStyle.height = '200px';
    albumImageStyle.maxWidth = '200px';
    albumImageStyle.maxHeight = '200px';
    albumCardStyle.width = '203px';
    albumCardStyle.height = '220px';
    albumCardStyle.maxWidth = '203px';
    albumCardStyle.maxHeight = '220px';
  }

  if (coverSize === 'medium') {
    albumImageStyle.width = '300px';
    albumImageStyle.height = '300px';
    albumImageStyle.maxWidth = '300px';
    albumImageStyle.maxHeight = '300px';
    albumCardStyle.width = '303px';
    albumCardStyle.height = '320px';
    albumCardStyle.maxWidth = '303px';
    albumCardStyle.maxHeight = '320px';
  }

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
    <Card className="albumCard" style={albumCardStyle} onClick={() => {
      if (!settings.features.isLocked) {
        navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
      }
    }}>
      <Card.Img top src={coverArt} style={albumImageStyle} />
      {!coverArtOnly && (
        <Card.Body className="albumCardBody" style={albumNameStyle}>
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
