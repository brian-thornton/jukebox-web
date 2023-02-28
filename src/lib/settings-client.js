import { getData, post } from './service-helper';

const path = '/settings';

export const getSettings = () => getData(`${path}/getSettings`);
export const updateSettings = (body) => post(`${path}/updateSettings`, body);
export const getRestrictionGroups = () => getData(`${path}/restrictionGroups`);
export const createRestrictionGroup = (body) => post(`${path}/createRestrictionGroup`, body);
export const updateRestrictionGroup = (body) => post(`${path}/updateRestrictionGroup`, body);
export const deleteRestrictionGroup = (body) => post(`${path}/deleteRestrictionGroup`, body);
