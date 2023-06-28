import { getBlob, getData, page, post, postParams } from './service-helper';
import defaultCover from './default_album.jpg';
import { updateArtHistory } from './status-client';
const albumArt = require('album-art');
const path = '/librarian';

export const getLibraries = () => getData(`${path}/libraries`);
export const getByCategory = (category) => getData(`${path}/getByCategory?category=${category}`);
export const getCoverArt = (url) => getBlob(`${path}/coverArt?path=${url}`);
export const getAlbumTracks = (url) => getData(`${path}/albumTracks?path=${url}`);
export const discover = (url) => getData(`${path}/discover?path=${url}`);
export const getTrackAlbums = (tracks) => post(`${path}/getTrackAlbums`, tracks);
export const add = (library) => post(`${path}/add`, library);
export const saveCoverArt = (cover) => post(`${path}/saveCoverArt`, cover);
export const removeCoverArt = (album) => post(`${path}/removeCoverArt`, album);

export const getAlbums = (start, limit, category, selectedLibraries, restriction, genre) => {
  if (category) {
    return getData(`${path}/albums?${page(start, limit)}&category=${category}&restriction=${restriction}`);
  };

  if (genre) {
    return getData(`${path}/albums?${page(start, limit)}&genre=${genre}&restriction=${restriction}`);
  };

  if (selectedLibraries?.length) {
    return getData(`${path}/albums?${page(start, limit)}&filters=${selectedLibraries.map((lib) => lib.path)}`);
  }

  return getData(`${path}/albums?${page(start, limit)}&restriction=${restriction}`);
};

export const getTrackAlbum = async (track) => {
  return await getData(`${path}/getTrackAlbum?track=${track}`);
};

export const searchAlbums = (search, start, limit, startsWithFilter) => {
  let url = `${path}/search?search=${search}&type=albums&${page(start, limit)}`;

  if (startsWithFilter) {
    url += `&startsWithFilter=${startsWithFilter}`;
  }

  return getData(url);
};

export const searchTracks = (search, start, limit) => {
  return getData(`${path}/search?search=${search}&type=tracks&${page(start, limit)}`);
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

export const coverArtUrl = async (album, skinDefaultCover) => {
  const nameArray = album.name.split('-');
  const artist = nameArray[0];
  const albumName = nameArray[1];

  const existingCover = await getCoverArt(album.path);

  if (existingCover && existingCover.type === 'image/jpeg') {
    return {
      url: URL.createObjectURL(existingCover),
      isLocal: true
    };
  } else {

    const artHistory = await getData(`/status/getArtHistory`);
    if (album.allowCoverArtDownload && !artHistory?.requests.includes(album.path)) {
      await updateArtHistory({ albumPath: album.path });

      const data = await albumArt(artist, { album: JSON.stringify(albumName) });

      if (data.toString().includes('http')) {
        return {
          url: data,
          isLocal: false
        };
      }
    }
  }

  return {
    url: skinDefaultCover || defaultCover,
    isDefault: true
  };
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

