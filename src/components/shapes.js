import PropTypes from 'prop-types';

export const Album = PropTypes.shape({
  name: PropTypes.string,
  path: PropTypes.string,
  coverArtExists: PropTypes.bool,
  trackCount: PropTypes.number,
});

export const Albums = PropTypes.shape(PropTypes.arrayOf(Album));

export const Controller = PropTypes.shape({
  ip: PropTypes.string,
});

export const ControllerState = PropTypes.shape({
  effects: PropTypes.arrayOf(PropTypes.string),
  palettes: PropTypes.arrayOf(PropTypes.string),
});

export const Track = PropTypes.shape({
  name: PropTypes.string,
  path: PropTypes.string,
  id: PropTypes.string,
});

export const Playlist = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  tracks: PropTypes.arrayOf(Track),
});

export const Option = PropTypes.shape({
  display: PropTypes.string,
  value: PropTypes.string,
});

export const Options = PropTypes.arrayOf(Option);

export const Library = PropTypes.shape({
  path: PropTypes.string,
  category: PropTypes.string,
  allowCoverArtDownload: PropTypes.bool,
  enabled: PropTypes.bool,
  name: PropTypes.string,
  scanStatus: PropTypes.string,
  albums: PropTypes.arrayOf(Album),
});

export const Libraries = PropTypes.arrayOf(Library);

export const Event = PropTypes.shape({
  target: {
    value: PropTypes.string,
  },
});

export const Item = PropTypes.shape({
  text: PropTypes.string,
  buttons: PropTypes.node,
});

export const Items = PropTypes.arrayOf(Item);

export const Tracks = PropTypes.arrayOf(Track);

export const LightingController = PropTypes.shape({
  ip: PropTypes.string,
  info: PropTypes.shape({
    ip: PropTypes.string,
  }),
});

export const Skin = PropTypes.shape({
  name: PropTypes.string,
  isEditable: PropTypes.bool,
  headerColor: PropTypes.string,
  footerColor: PropTypes.string,
  fontColor: PropTypes.string,
  fontWeight: PropTypes.string,
  backgroundColor: PropTypes.string,
  popupBackgroundColor: PropTypes.string,
  buttonBackgroundColor: PropTypes.string,
  buttonFontColor: PropTypes.string,
  buttonFontWeight: PropTypes.string,
  trackBackgroundColor: PropTypes.string,
  lighting: PropTypes.shape({
    controllers: PropTypes.arrayOf(LightingController),
  })
});

export const RestrictionMode = PropTypes.shape({
  content: PropTypes.arrayOf(PropTypes.string),
});

export const Segment = PropTypes.shape({
  start: PropTypes.number,
  stop: PropTypes.number,
});

export const Segments = PropTypes.arrayOf(Segment);

export const Skins = PropTypes.arrayOf(Skin);

export const Settings = PropTypes.shape({
  features: {
    albums: PropTypes.bool,
    tracks: PropTypes.bool,
    playlists: PropTypes.bool,
    queue: PropTypes.bool,
    settings: PropTypes.bool,
    volume: PropTypes.bool,
    next: PropTypes.bool,
    stop: PropTypes.bool,
    play: PropTypes.bool,
    playNow: PropTypes.bool,
    enqueue: PropTypes.bool,
    playAlbum: PropTypes.bool,
    addToPlaylist: PropTypes.bool,
    deletePlaylist: PropTypes.bool,
    admin: PropTypes.bool,
  },
  preferences: {
    name: PropTypes.string,
  },
  pin: PropTypes.string,
  styles: {
    headerColor: PropTypes.string,
    footerColor: PropTypes.string,
    fontColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    popupBackgroundColor: PropTypes.string,
    buttonBackgroundColor: PropTypes.string,
  },
});

export const Colors = PropTypes.shape({
  headerColor: PropTypes.string,
  footerColor: PropTypes.string,
  fontColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  popupBackgroundColor: PropTypes.string,
  buttonBackgroundColor: PropTypes.string,
});

export const Style = PropTypes.shape({
  headerColor: PropTypes.string,
  footerColor: PropTypes.string,
  fontColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  popupBackgroundColor: PropTypes.string,
  buttonBackgroundColor: PropTypes.string,
  marginTop: PropTypes.string,
  marginBottom: PropTypes.string,
  fontSize: PropTypes.string,
  fontFamily: PropTypes.string,
});

export const Page = PropTypes.shape({
  start: PropTypes.number,
  limit: PropTypes.number,
});

