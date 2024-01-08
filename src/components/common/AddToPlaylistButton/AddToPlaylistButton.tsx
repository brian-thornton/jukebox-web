import { PlusSquare } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';

import Button from '../Button/Button';
import { ITrack } from '../../interface';

interface IAddToPlaylistButton {
  track: ITrack,
}

const AddToPlaylistButton: FC<IAddToPlaylistButton> = ({ track }) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        navigate('/playlists', { state: { tracks: [track] } });
      }}
      icon={<PlusSquare />}
    />
  );
};

export default AddToPlaylistButton;
