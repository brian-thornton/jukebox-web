import Card from 'react-bootstrap/Card';
import { FC, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { IAlbum } from './interface';
import { coverArtUrl } from '../lib/librarian-client';
import { SettingsContext } from './layout/SettingsProvider';
import './TrackAlbum.scss';
import { bigButtons } from '../lib/styleHelper';

interface ITrackAlbum {
  album: IAlbum,
};

const TrackAlbum: FC<ITrackAlbum> = ({ album }) => {
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
            if (settings?.features?.albums) {
              navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
            }
          }
          }
        >
          <Card.Img src={coverArt} style={{ height: heightAndWidth, width: heightAndWidth }} />
        </Card>
      )}
    </>
  );
};

export default TrackAlbum;
