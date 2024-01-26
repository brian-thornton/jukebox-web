import { PencilSquare } from 'react-bootstrap-icons';
import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../common/Buttons/Button/Button';
import Item from '../../common/Item/Item';
import { IPlaylist } from '../../interface';
import { SettingsContext } from '../../layout/SettingsProvider';

interface IPlaylistRow {
  playlist: IPlaylist,
  addMode: boolean,
  onAdd: Function,
  onSelect: Function,
}

const PlaylistRow: FC<IPlaylistRow> = ({
  playlist,
  addMode,
  onAdd,
  onSelect,
}) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings?.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;

  return (
    <Item
      onClick={() => onSelect(playlist.name)}
      text={playlist.name}
      buttons={addMode ? (
        <Button
          height={buttonHeight.toString()}
          onClick={() => onAdd(playlist.name)}
          content={<FormattedMessage id="add" />}
        />
      ) : (
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
