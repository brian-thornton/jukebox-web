import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { FC, useContext } from 'react';

import { IAlbum as AlbumInterface } from '../../interface';
import { SettingsContext } from '../../layout/SettingsProvider';
import classes from './Album.module.css';
import { useCoverArt } from './album-hooks';

interface IAlbum {
  album: AlbumInterface,
  coverArtOnly: boolean,
}

const Album: FC<IAlbum> = ({ album, coverArtOnly }) => {
  const settings = useContext(SettingsContext);
  const { coverArt, loading: coverArtLoading } = useCoverArt(album, settings);
  const navigate = useNavigate();
  const { preferences, features } = settings || {};
  const { coverSize, showAlbumName } = preferences || { coverSize: 'medium' };
  const isMediumCover = coverSize === 'medium';
  let albumImageClass;

  const albumCardStyle = {
    width: isMediumCover ? '303px' : '203px',
    height: isMediumCover ? '320px' : '220px',
    maxWidth: isMediumCover ? '303px' : '203px',
    maxHeight: isMediumCover ? '320px' : '220px',
  };

  if (coverSize === 'large') {
    albumCardStyle.width = '400px';
    albumCardStyle.height = '420px';
    albumCardStyle.maxWidth = '400px';
    albumCardStyle.maxHeight = '420px';
  }

  return !coverArtLoading ? (
    <div
      className={classes.albumCard}
      style={albumCardStyle}
      onClick={() => {
        if (!features?.isLocked) {
          navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
        }
      }}
    >
      <Card.Img src={coverArt} className={albumImageClass} />
      {!coverArtOnly && (
        <div className={classes.albumCardBody}>
          {showAlbumName && album.name}
        </div>
      )}
    </div>
  ) : null;
};

export default Album;
