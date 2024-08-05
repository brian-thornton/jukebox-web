import { PencilSquare } from 'react-bootstrap-icons';
import { FC, useContext } from 'react';

import Button from '../../common/Buttons/Button/Button';
import Item from '../../common/Item/Item';
import { IPlaylist } from '../../interface';
import { SettingsContext } from '../../layout/SettingsProvider';

interface IPlaylistRow {
  playlist: IPlaylist,
  addMode: boolean,
  onSelect: Function,
}

const PlaylistRow: FC<IPlaylistRow> = ({
  playlist,
  onSelect,
}) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings?.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;

  return (
    <Item
      onClick={() => onSelect(playlist.name)}
      text={playlist.name}
      buttons={(
        <Button
          height={buttonHeight.toString()}
          onClick={() => onSelect(playlist.name)}
          content={<PencilSquare />}
        />
      )}
    />
  );
};

export default PlaylistRow;
