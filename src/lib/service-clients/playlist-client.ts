import { getData, post } from '../helper/service-helper';

import { IPlaylist, ITrack } from '../../components/interface';

const path = '/playlists';
export const add = (playlist: IPlaylist) => post(`${path}/add`, playlist);
export const deletePlaylist = (name: string) => post(`${path}/delete`, { name });
export const getPlaylist = (name: string) => getData(`${path}/getPlaylist?name=${name}`);

export const getPlaylists = (start: number, limit: number) => {
  return getData(`${path}/getAll?start=${start}&limit=${limit}`);
};

export const addTracksToPlaylist = (name: string, tracks: Array<ITrack>) => {
  return post(`${path}/addToPlaylist`, { name, tracks });
};

export const removeTracksFromPlaylist = (name: string, tracks: Array<ITrack>) => {
  return post(`${path}/removeFromPlaylist`, { name, tracks });
};

export const addTrackAtPosition = (name: string, track: ITrack, position: number) => {
  return post(`${path}/addTrackAtPosition`, { name, track, position });
}
