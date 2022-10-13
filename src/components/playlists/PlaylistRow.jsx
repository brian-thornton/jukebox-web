import { PropTypes } from 'prop-types';
import React from 'react';

import Button from '../Button';
import Item from '../common/Item';
import { Tracks } from '../shapes';
import './PlaylistsViewer.scss';

const propTypes = {
  currentPlaylist: PropTypes.string,
  tracks: Tracks.isRequired,
};

const PlaylistRow = ({ playlist, addMode, onAdd, onSelect }) => {
  return (
    <Item
      onClick={() => onSelect(playlist.name)}
      text={playlist.name}
      buttons={(
        <>
          {addMode && (
            <Button
              onClick={() => onAdd(playlist.name)}
              content="Add"
            />
          )}
          {!addMode && (
            <Button
              onClick={() => onSelect(playlist.name)}
              content="Edit"
            />
          )}
        </>
      )}
    />
  );
}

PlaylistRow.propTypes = propTypes;

export default PlaylistRow;
