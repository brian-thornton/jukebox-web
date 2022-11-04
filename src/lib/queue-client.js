import { getData, page, post } from './service-helper';

const path = '/queue';
export const clearQueue = () => post(`${path}/clearQueue`, {});
export const enqueueTracks = (tracks) => post(`${path}/enqueueTracks`, tracks);
export const enqueueTop = (track) => enqueueTracksTop([track]);
export const enqueue = (track) => enqueueTracks([track]);
export const play = () => getData(`${path}/play`);
export const next = () => getData(`${path}/next`);

export const getQueue = (start, limit) => {
  return getData(`${path}/getQueue?${page(start, limit)}`);
};

export const stop = async () => {
  let response;
  if (window.accessToken) {
    response = await fetch(`${path}/stop?token=${window.accessToken}`);
  } else {
    response = await fetch(`${path}/stop`);
  }
  return response;
}

export const enqueueTracksTop = (tracks) => {
  return post(`${path}/enqueueTracksTop`, tracks);
};

export const removeTracksFromQueue = (tracks) => {
  return post(`${path}/removeFromQueue`, { tracks });
};

