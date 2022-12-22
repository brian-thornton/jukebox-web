import { getData } from './service-helper';

const path = '/metadata';
export const getArtistsByGenre = (genre) => getData(`${path}/getArtistsByGenre?genre=${genre}`);
export const linkGenereToLibrary = genre => getData(`${path}/linkGenre?genre=${genre}`);
