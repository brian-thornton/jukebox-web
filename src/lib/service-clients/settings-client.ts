import { getData, post } from '../helper/service-helper';

import { ISettings, IRestrictionGroup } from '../../components/interface';

const path = '/settings';

export const getSettings = () => getData(`${path}/getSettings`);
export const updateSettings = (body: ISettings) => post(`${path}/updateSettings`, body);
export const getRestrictionGroup = (name: string) => getData(`${path}/restrictionGroups?name=${name}`);
export const getRestrictionGroups = () => getData(`${path}/restrictionGroups`);
export const createRestrictionGroup = (body: IRestrictionGroup) => post(`${path}/createRestrictionGroup`, body);
export const updateRestrictionGroup = (body: IRestrictionGroup) => post(`${path}/updateRestrictionGroup`, body);
export const deleteRestrictionGroup = (body: IRestrictionGroup) => post(`${path}/deleteRestrictionGroup`, body);
