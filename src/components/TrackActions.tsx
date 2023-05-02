import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { FC, useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import { ITrack } from './interface';
import { coverArtUrl } from '../lib/librarian-client';
import { SettingsContext } from './layout/SettingsProvider';
import './TrackAlbum.scss';
import { bigButtons } from '../lib/styleHelper';
import Button from './Button';
import Picker from './common/Picker';
import { enqueue } from '../lib/queue-client';
import { enqueueTop, next } from '../lib/queue-client';

interface ITrackActions {
  track?: ITrack,
  onClose: Function,
};

const TrackAlbum: FC<ITrackActions> = ({ track, onClose }) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const [coverArt, setCoverArt] = useState();
  const heightAndWidth = bigButtons(settings) ? '60px' : '';

  const playNow = () => {
    enqueueTop(track);
    next();
  };

  return (
    <Picker
      applyPadding={false}
      items={[
        {
          buttonText: "Play Now",
          buttonWidth: "100%",
          onClick: () => {
            playNow();
            onClose();
          },
        },
        {
          buttonText: "Enqueue",
          buttonWidth: "100%",
          onClick: () => {
            enqueue(track);
            onClose();
          },
        },
        {
          buttonText: "Add to Playlist",
          buttonWidth: "100%",
          onClick: () => { navigate('/playlists', { state: { tracks: [track] } }); },
        },
        {
          buttonText: "Cancel",
          buttonWidth: "100%",
          onClick: () => onClose(),
        },
      ]}
    />
  );
};

export default TrackAlbum;
