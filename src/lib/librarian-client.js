import { getBlob, getData, page, post, postParams } from './service-helper';
import defaultCover from './default_album.jpg';
const albumArt = require('album-art');
const path = '/librarian';

export const getLibraries = () => getData(`${path}/libraries`);
export const getCoverArt = (url) => getBlob(`${path}/coverArt?path=${url}`);
export const getAlbumTracks = (url) => getData(`${path}/albumTracks?path=${url}`);
export const discover = (url) => getData(`${path}/discover?path=${url}`);
export const getTrackAlbums = (tracks) => post(`${path}/getTrackAlbums`, tracks);
export const add = (library) => post(`${path}/add`, library);
export const saveCoverArt = (cover) => post(`${path}/saveCoverArt`, cover);
export const removeCoverArt = (album) => post(`${path}/removeCoverArt`, album);

export const getAlbums = (start, limit) => {
  return getData(`${path}/albums?${page(start, limit)}`);
};

export const getTrackAlbum = async (track) => {
  return await getData(`${path}/getTrackAlbum?track=${track}`);
};

export const searchAlbums = (search) => {
  return getData(`${path}/search?search=${search}&type=albums`);
};

export const searchTracks = (search) => {
  return getData(`${path}/search?search=${search}&type=tracks`);
};

export const getTracks = (start, limit) => {
  return getData(`${path}/tracks?${page(start, limit)}`);
};

export const deleteLibrary = async (name) => {
  const response = await fetch(`${path}/?name=${name}`, {
    method: 'delete',
  });
  return response;
}

export const coverArtUrl = async (album) => {
  const nameArray = album.name.split('-');
  const artist = nameArray[0];
  const albumName = nameArray[1];
  const existingCover = await getCoverArt(album.path);

  if (existingCover && existingCover.type === 'image/jpeg') {
    return URL.createObjectURL(existingCover);
  } else {
    const data = await albumArt(artist, { album: albumName });

    if (data.toString().includes('http')) {
      return data;
    } 
  }

  return defaultCover;
}

export const scan = async (library) => {
  // Clear tracks from previous scans so we are not sending a large
  // volume of data over the wire that will be overwritten.
  delete library.tracks;
  const response = await fetch(`${path}/scan`, postParams(library));
  return response;
}

export const downloadTrack = async (track) => {
  const response = await fetch(`${path}/downloadTrack?file=${track.path}`);
  return response;
}

