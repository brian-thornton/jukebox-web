import { getData } from './service-helper';

const path = '/metadata';
export const getArtistsByGenre = (genre: string) => getData(`${path}/getArtistsByGenre?genre=${genre}`);
export const linkGenereToLibrary = (genre: string) => getData(`${path}/linkGenre?genre=${genre}`);
