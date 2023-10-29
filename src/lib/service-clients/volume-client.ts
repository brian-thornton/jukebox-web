import { getData } from '../helper/service-helper';

const path = '/volume';
export const up = async () => getData(`${path}/up`);
export const down = async () => getData(`${path}/down`);

