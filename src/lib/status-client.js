import { getData, post } from './service-helper';

const path = '/status';
export const getStatus = () => getData(`${path}/getStatus`);
export const updateStatus = (body) => post(`${path}/updateStatus`, body);
export const getArtHistory = () => getData(`${path}/getArtHistory`);
export const updateArtHistory = (albumPath) => post(`${path}/updateArtHistory`, albumPath);
