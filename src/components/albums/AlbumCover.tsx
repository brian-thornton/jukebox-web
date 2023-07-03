import Card from 'react-bootstrap/Card';
import { FC, useContext, useState, useEffect } from 'react';

import { coverArtUrl } from '../../lib/librarian-client';
import { IAlbum } from '../interface';
import styles from './AlbumCover.module.css';
import { SettingsContext } from '../layout/SettingsProvider';

interface IAlbumCover {
  album: IAlbum,
  isListCover?: boolean,
};

const AlbumCover: FC<IAlbumCover> = ({ album, isListCover = false }) => {
  const [coverArt, setCoverArt] = useState('');
  const settings = useContext(SettingsContext);
  const { defaultAlbumCover } = settings?.styles || {};

  const loadCoverArt = () => {
    coverArtUrl(album, defaultAlbumCover).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);

  let coverClass = settings.screen?.isMobile ? styles.albumCoverMobile : styles.albumCover;
  if (isListCover) {
    coverClass = styles.albumCoverList;
  }
  
  return <Card.Img src={coverArt} className={coverClass} />;
};

export default AlbumCover;
