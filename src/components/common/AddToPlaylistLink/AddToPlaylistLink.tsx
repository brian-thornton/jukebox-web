import { useNavigate } from 'react-router-dom';
import { FC } from 'react';

import { ITrack } from '../../interface';
import styles from './AddToPlaylistLink.module.css';  

interface IAddToPlaylistLink {
  track: ITrack,
}

const AddToPlaylistLink: FC<IAddToPlaylistLink> = ({ track }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.addToPlaylistLink}  
      onClick={() => {
        navigate('/playlists', { state: { tracks: [track] } });
      }}
    >
      Add To Playlist
    </div>
  );
};

export default AddToPlaylistLink;
