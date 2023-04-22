import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { FC, useEffect, useContext, useState } from 'react';

import './Album.scss';
import { IAlbum as AlbumInterface } from '../interface';
import { coverArtUrl, saveCoverArt } from '../../lib/librarian-client';
import { SettingsContext } from '../layout/SettingsProvider';

// @ts-ignore
import defaultCover from './default_album.jpg';

interface IAlbum {
  album: AlbumInterface,
  coverArtOnly: boolean,
};

const Album: FC<IAlbum> = ({ album, coverArtOnly }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const { styles, preferences, features } = settings || {};
  const { coverSize, showAlbumName } = preferences || { coverSize: 'medium' };
  const [coverArt, setCoverArt] = useState(defaultCover);
  const isMediumCover = coverSize === 'medium';

  const loadCoverArt = () => {
    if (album.coverArtExists || settings?.features?.admin) {
      coverArtUrl(album, settings?.styles?.defaultAlbumCover).then((data) => {
        setCoverArt(data.url);

        if (!data.isLocal && !data.isDefault) {
          saveCoverArt({ album, url: data.url });
        }
      });
    }
  };

  useEffect(() => loadCoverArt(), []);

  const albumNameStyle = {
    color: styles?.fontColor,
    fontFamily: styles?.buttonFont,
  };

  const albumImageStyle = {
    width: isMediumCover ? '300px' : '200px',
    height: isMediumCover ? '300px' : '200px',
    maxWidth: isMediumCover ? '300px' : '200px',
    maxHeight: isMediumCover ? '300px' : '200px',
  };

  const albumCardStyle = {
    width: isMediumCover ? '303px' : '203px',
    height: isMediumCover ? '320px' : '220px',
    maxWidth: isMediumCover ? '303px' : '203px',
    maxHeight: isMediumCover ? '320px' : '220px',
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
        if (!features?.isLocked) {
          navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
        }
      }}
    >
      <Card.Img src={coverArt} style={albumImageStyle} />
      {!coverArtOnly && (
        <Card.Body className="albumCardBody" style={albumNameStyle}>
          {showAlbumName && album.name}
        </Card.Body>
      )}
    </Card>
  );
};

export default Album;
