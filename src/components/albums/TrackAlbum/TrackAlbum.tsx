import Card from 'react-bootstrap/Card';
import { FC, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { IAlbum } from '../../interface';
import { coverArtUrl } from '../../../lib/service-clients/librarian-client';
import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './TrackAlbum.module.css';
import { bigButtons } from '../../../lib/helper/styleHelper';

interface ITrackAlbum {
  album: IAlbum,
}

const TrackAlbum: FC<ITrackAlbum> = ({ album }) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const [coverArt, setCoverArt] = useState();
  const heightAndWidth = bigButtons(settings) ? '60px' : '50px';

  const loadCoverArt = () => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);

  return (
    <>
      {coverArt && (
        <Card
          className={styles.trackAlbumCard}
          onClick={() => {
            if (settings?.features?.albums) {
              navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
            }
          }}
        >
          <Card.Img src={coverArt} style={{ height: heightAndWidth, width: heightAndWidth }} />
        </Card>
      )}
    </>
  );
};

export default TrackAlbum;
