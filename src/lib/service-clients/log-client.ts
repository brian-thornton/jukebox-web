import { getData } from '../helper/service-helper';

const path = '/log';
export const getLogs = (start: Number, limit: Number, level: string) => (
  getData(`${path}/get?start=${start}&limit=${limit}&level=${level}`)
);

