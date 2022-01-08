import React, { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

import {
  getHeight,
  initializePaging,
  pageLimit,
  pageStart,
  previousPage,
  nextPage,
} from '../../lib/pageHelper';
import { getPlaylists, add, addTracksToPlaylist } from '../../lib/playlist-client';

import { SettingsContext } from './layout/SettingsProvider';

import Item from '../common/Item';

function Playlists({ paging, setPaging }) {
  const [isEmpty, setIsEmpty] = useState(false);
  const settings = useContext(SettingsContext);

  const loadPlaylists = (loadPage) => {
    const start = pageStart(loadPage, paging);
    let limit = pageLimit(loadPage, paging);

    if (start === 0) {
      limit += 1;
    }

    getPlaylists(start, limit).then((data) => {
      setPlaylists(data.playlists);
      if (data.playlists.length === 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }

      if (!paging) {
        setPaging(initializePaging(data.totalPlaylists, 60, initialHeight));
      }
    });
  };

  useEffect(() => {
    if (paging) {
      loadPlaylists(paging.currentPage);
    }
  }, [paging]);

  if (!playlists.length) {
    loadPlaylists();
  }

  renderPlaylists = playlists.map(playlist => (
    <Item
      onClick={() => selectPlaylist(playlist.name)}
      text={playlist.name}
      buttons={buttons(playlist.name)}
    />
  ));

  return renderPlaylists;

}

Playlists.defaultProps = {
  isScreenSmall: false,
};

Playlists.propTypes = propTypes;

export default Playlists;
