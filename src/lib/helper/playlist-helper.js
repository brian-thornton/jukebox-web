import { enqueueTracks, enqueueTracksTop, play } from '../service-clients/queue-client';
import { deletePlaylist, add } from '../service-clients/playlist-client';

export const runPlaylist = (tracks) => {
  enqueueTracksTop(tracks);
  play();
};

export const enqueuePlaylist = (tracks) => {
  enqueueTracks(tracks);
};

export const shuffle = (name, tracks, reload) => {
  deletePlaylist(name).then(() => {
    const newOrder = tracks.sort(() => Math.random() - 0.5);

    add({
      name,
      tracks: newOrder,
    }).then(() => reload(name));
  });
};
