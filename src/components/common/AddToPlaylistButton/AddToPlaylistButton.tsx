import { PlusSquare } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import React, { FC, useContext } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import Button from '../../Button';
import { ITrack } from '../../interface';
import { bigButtons } from '../../../lib/styleHelper';

interface IAddToPlaylistButton {
  track: ITrack,
}

const AddToPlaylistButton: FC<IAddToPlaylistButton> = ({ track }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const heightAndWidth = bigButtons(settings) ? '60' : '';
  const fontSize = bigButtons(settings) ? '30px' : '';

  return (
    <>
      <Button
        style={{ fontSize }}
        width={heightAndWidth}
        height={heightAndWidth}
        onClick={() => {
          navigate('/playlists', { state: { tracks: [track] } });
        }}
        icon={<PlusSquare />}
      />
    </>
  );
};

export default AddToPlaylistButton;
