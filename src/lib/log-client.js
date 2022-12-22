import { getData } from './service-helper';

const path = '/log';
export const getLogs = (start, limit, level) => getData(`${path}/get?start=${start}&limit=${limit}&level=${level}`);

