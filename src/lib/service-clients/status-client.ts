import { getData, post } from '../helper/service-helper';

const path = '/status';
export const getStatus = () => getData(`${path}/getStatus`);
export const updateStatus = (body: any) => post(`${path}/updateStatus`, body);
export const getArtHistory = () => getData(`${path}/getArtHistory`);
export const updateArtHistory = (albumPath: string) => post(`${path}/updateArtHistory`, albumPath);
