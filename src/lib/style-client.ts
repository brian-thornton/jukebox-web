import { getData, post } from './service-helper';

import { ISkin } from '../components/interface';

const path = '/styles';
export const getSkins = async () => getData(`${path}/skins`);
export const createSkin = async (skin: ISkin) => post(`${path}/skins`, skin);
export const deleteSkin = async (name: string) => post(`${path}/delete`, { name });

