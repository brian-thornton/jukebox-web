import { getData, post } from './service-helper';

const path = '/radio';
export const getStations = (category, start, limit) => getData(`${path}/getStations?category=${category}&start=${start}&limit=${limit}`);
export const play = (url, host, port, password) => getData(`${path}/play?url=${url}&host=${host}&port=${port}&password=${password}`);
export const stop = (host, port, password) => getData(`${path}/stop?host=${host}&port=${port}&password=${password}`);
export const status = (host, port, password) => getData(`${path}/status?host=${host}&port=${port}&password=${password}`);
