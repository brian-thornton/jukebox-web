import { getData, post } from './service-helper';

const path = '/settings';
export const getSettings = () => getData(`${path}/getSettings`);
export const updateSettings = (body) => post(`${path}/updateSettings`, body);
