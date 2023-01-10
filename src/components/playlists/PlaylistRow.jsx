import { PencilSquare } from 'react-bootstrap-icons';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import { injectIntl } from 'react-intl';

import Button from '../Button';
import Item from '../common/Item';
import { Playlist } from '../shapes';
import './PlaylistsViewer.scss';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  playlist: Playlist.isRequired,
  addMode: PropTypes.bool,
  onAdd: PropTypes.func,
  onSelect: PropTypes.func,
};

const PlaylistRow = ({
  intl,
  playlist,
  addMode,
  onAdd,
  onSelect,
}) => {
  const settings = useContext(SettingsContext);
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;
  const fontSize = ['large', 'medium'].includes(controlButtonSize) ? '30px' : '';

  return (
    <Item
      onClick={() => onSelect(playlist.name)}
      text={playlist.name}
      buttons={(
        <>
          {addMode && (
            <Button
              height={buttonHeight}
              onClick={() => onAdd(playlist.name)}
              content={intl.formatMessage({ id: 'add' })}
            />
          )}
          {!addMode && (
            <Button
              style={{ fontSize }}
              height={buttonHeight}
              onClick={() => onSelect(playlist.name)}
              content={<PencilSquare />}
            />
          )}
        </>
      )}
    />
  );
};


PlaylistRow.defaultProps = {
  addMode: false,
  onAdd: () => { },
  onSelect: () => { },
};

PlaylistRow.propTypes = propTypes;

export default injectIntl(PlaylistRow);
