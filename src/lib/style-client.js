import { getData, post } from './service-helper';

const path = '/styles';
export const getSkins = async () => getData(`${path}/skins`);
export const createSkin = async (skin) => post(`${path}/skins`, skin);
export const deleteSkin = async (name) => post(`${path}/delete`, { name });

