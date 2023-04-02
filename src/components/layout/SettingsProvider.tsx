import { createContext } from 'react';

interface ICategory {
  category: string,
  enabled: string,
}

interface IController {
  name: string,
  ip: string,
  mac: string,
  online: boolean
}

interface IFeatures {
  albums: boolean,
  tracks: boolean,
  playlists: boolean,
  radio: boolean,
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
  downloadTrack: boolean,
  isLocked: boolean,
  genres: boolean,
}

interface IPreferences {
  name: string,
  showAlbumName: boolean,
  showAlbumsWithoutCoverArt: boolean,
  pinEnabled: boolean,
  pin: string,
  startsWithLocation: string,
  showLibraryFilter: boolean,
  showAlbumTable: boolean,
  vlcHost: string,
  vlcPort: string,
  vlcPassword: string,
  coverSize: string,
  experimentalMode: boolean,
}

interface IStyles {
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
  headerFont: string,
  navButtonType: string,
  buttonFont: string,
  controlButtonSize: string,
  activeButtonColor: string,
  listFont: string,
  wallpaper: string,
  navButtonSize: string,
  buttonShape: string,
  controlUseBackground: boolean,
}

interface ISettings {
  display?: String,
  features?: IFeatures,
  preferences?: IPreferences,
  pin?: string,
  styles?: IStyles,
  categories?: [ICategory],
  controllers?: [IController],
  isScreenSmall?: boolean,
}

export const SettingsContext = createContext<ISettings>({});