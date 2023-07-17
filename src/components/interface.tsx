export interface ITrack {
  name: string,
  path: string,
  id: string,
};

export interface IAlbum {
  id: string,
  name: string,
  path: string,
  coverArtExists: boolean,
  trackCount: number,
};

export interface IController {
  ip: string,
};

export interface IControllerState {
  effects: Array<string>,
  palettes: Array<string>,
};

export interface ILog {
  text: string,
};

export interface IPlaylist {
  id: string,
  name: string,
  tracks: Array<ITrack>,
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
  albums: Array<IAlbum>,
  totalTracks: number,
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
  name: string,
};

export interface ISegment {
  start: number,
  stop: number,
};

export interface ISettings {
  features?: {
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
  preferences?: {
    name: string,
    startsWithLocation: string,
    offlineLibraries: boolean,
  },
  pin?: string,
  styles?: {
    headerColor: string,
    footerColor: string,
    fontColor: string,
    backgroundColor: string,
    popupBackgroundColor: string,
    buttonBackgroundColor: string,
  },
  search?: string,
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
  headerColor?: string,
  footerColor?: string,
  fontColor?: string,
  backgroundColor?: string,
  popupBackgroundColor?: string,
  buttonBackgroundColor?: string,
  marginTop?: string,
  marginBottom?: string,
  fontSize?: string,
  fontFamily?: string,
  defaultAlbumCover?: string,
  headerFont?: string,
  navButtonSize?: string,
};

export interface IQueue {
  tracks: Array<ITrack>,
  totalTracks: number,
};

export interface IPage {
  start: number,
  limit: number,
};

