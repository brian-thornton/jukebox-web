export interface ITrack {
  name: string,
  path: string,
  id: string,
};

export interface IAlbum {
  name: string,
  path: string,
  coverArtExists: boolean,
  trackCount: number,
};

export interface IController {
  ip: string,
};

export interface IControllerState {
  effects: [string],
  palettes: [string],
};

export interface ILog {
  text: string,
};

export interface IPlaylist {
  id: string,
  name: string,
  tracks: [ITrack],
};

export interface IOption {
  display: string,
  value: string,
};

export interface ILibrary {
  path: string,
  category: string,
  allowCoverArtDownload: boolean,
  enabled: boolean,
  name: string,
  scanStatus: string,
  albums: [IAlbum],
};

export interface IEvent {
  target: {
    value: string,
  },
};

export interface IItem {
  text: string,
  buttons: [any],
};

export interface ILightingController {
  ip: string,
  info: {
    ip: string,
  },
};

export interface ISkin {
  name: string,
  isEditable: boolean,
  headerColor: string,
  footerColor: string,
  fontColor: string,
  fontWeight: string,
  backgroundColor: string,
  popupBackgroundColor: string,
  buttonBackgroundColor: string,
  buttonFontColor: string,
  buttonFontWeight: string,
  trackBackgroundColor: string,
  lighting: {
    controllers: [ILightingController],
  }
};

export interface IRestrictionMode {
  content: [string],
};

export interface ISegment {
  start: number,
  stop: number,
};

export interface ISettings {
  features: {
    albums: boolean,
    tracks: boolean,
    playlists: boolean,
    queue: boolean,
    settings: boolean,
    volume: boolean,
    next: boolean,
    stop: boolean,
    play: boolean,
    playNow: boolean,
    enqueue: boolean,
    playAlbum: boolean,
    addToPlaylist: boolean,
    deletePlaylist: boolean,
    admin: boolean,
  },
  preferences: {
    name: string,
  },
  pin: string,
  styles: {
    headerColor: string,
    footerColor: string,
    fontColor: string,
    backgroundColor: string,
    popupBackgroundColor: string,
    buttonBackgroundColor: string,
  },
};

export interface IColors {
  headerColor: string,
  footerColor: string,
  fontColor: string,
  backgroundColor: string,
  popupBackgroundColor: string,
  buttonBackgroundColor: string,
};

export interface IStyle {
  headerColor: string,
  footerColor: string,
  fontColor: string,
  backgroundColor: string,
  popupBackgroundColor: string,
  buttonBackgroundColor: string,
  marginTop: string,
  marginBottom: string,
  fontSize: string,
  fontFamily: string,
};

export interface IPage {
  start: number,
  limit: number,
};

