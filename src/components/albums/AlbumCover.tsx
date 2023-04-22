import Card from 'react-bootstrap/Card';
import { FC, useContext, useState, useEffect } from 'react';

import { coverArtUrl } from '../../lib/librarian-client';
import { IAlbum } from '../interface';
import './AlbumCover.scss';
import { SettingsContext } from '../layout/SettingsProvider';

interface IAlbumCover {
  album: IAlbum,
};

const AlbumCover: FC<IAlbumCover> = ({ album }) => {
  const [coverArt, setCoverArt] = useState('');
  const settings = useContext(SettingsContext);
  const { defaultAlbumCover } = settings?.styles || {};

  const loadCoverArt = () => {
    coverArtUrl(album, defaultAlbumCover).then(data => setCoverArt(data.url));
  };

  useEffect(() => loadCoverArt(), []);
  return <Card.Img src={coverArt} className="albumCover" />;
};

export default AlbumCover;
