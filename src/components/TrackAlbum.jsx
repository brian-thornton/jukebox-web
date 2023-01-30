import Card from 'react-bootstrap/Card';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Album as albumShape } from './shapes';
import { coverArtUrl } from '../lib/librarian-client';
import { SettingsContext } from './layout/SettingsProvider';
import './TrackAlbum.scss';
import { bigButtons } from '../lib/styleHelper';

const propTypes = {
  album: albumShape.isRequired,
};

const TrackAlbum = ({ album }) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const [coverArt, setCoverArt] = useState();
  const heightAndWidth = bigButtons(settings) ? '60px' : '';

  const loadCoverArt = () => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);

  return (
    <>
      {coverArt && (
        <Card
          className="trackAlbumCard"
          onClick={() => {
            if (settings.features.albums) {
              navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
            }
          }
          }
        >
          <Card.Img top src={coverArt} style={{ height: heightAndWidth, width: heightAndWidth }} />
        </Card>
      )}
    </>
  );
};

TrackAlbum.propTypes = propTypes;

export default TrackAlbum;
