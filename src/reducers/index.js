function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return updateObject(state, { currentTrack: action.payload });
    case 'SET_CURRENT_ALBUM':
      return updateObject(state, { currentAlbum: action.payload });
    case 'SET_CURRENT_PLAYLIST':
      return updateObject(state, { currentPlaylist: action.payload });
    case 'SET_CURRENT_PLAYLIST_TRACKS':
      return updateObject(state, { currentPlaylistTracks: action.payload });
    case 'CLEAR_CURRENT_PLAYLIST':
      return updateObject(state, { currentPlaylist: '' });
    case 'CLEAR_CURRENT_TRACK':
      return updateObject(state, { currentTrack: '' });
    case 'CLEAR_CURRENT_ALBUM':
      return updateObject(state, { currentAlbum: action.payload });
    case 'SET_CURRENT_MODE':
      return updateObject(state, { mode: action.payload });
    case 'SET_SEARCH':
      return updateObject(state, { search: action.payload });
    default:
      return state;
  }
};

export default rootReducer;
