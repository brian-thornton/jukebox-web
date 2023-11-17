import { IQueue, ITrack } from '../../../src/components/interface';

export const isAlbumInQueue = (queue: IQueue, tracks: Array<ITrack>) => {
  let allTracksInQueue = queue?.tracks?.length > 0;

  if (tracks?.length > 0 && queue?.tracks?.length > 0) {
    tracks.map((track) => {
      if (!queue.tracks.find(t => t.path === track.path)) {
        allTracksInQueue = false;
      }
    });
  }

  return allTracksInQueue;
};

export default isAlbumInQueue;