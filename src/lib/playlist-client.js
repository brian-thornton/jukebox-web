import { getData, post } from './service-helper';

const path = '/playlists';
export const add = (playlist) => post(`${path}/add`, playlist);
export const deletePlaylist = (name) => post(`${path}/delete`, { name });
export const getPlaylist = (name) => getData(`${path}/getPlaylist?name=${name}`);

export const getPlaylists = (start, limit) => {
  return getData(`${path}/getAll?start=${start}&limit=${limit}`);
};

export const addTracksToPlaylist = (name, tracks) => {
  return post(`${path}/addToPlaylist`, { name, tracks });
};

export const removeTracksFromPlaylist = (name, tracks) => {
  return post(`${path}/removeFromPlaylist`, { name, tracks });
};

export const addTrackAtPosition = (name, track, position) => {
  return post(`${path}/addTrackAtPosition`, { name, track, position });
}
