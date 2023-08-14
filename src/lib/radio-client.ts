import { getData } from './service-helper';

const path = '/radio';
export const getStations = (category: string, start: number, limit: number) => (
  getData(`${path}/getStations?category=${category}&start=${start}&limit=${limit}`)
);

export const play = (url?: string, host?: string, port?: string, password?: string) => (
  getData(`${path}/play?url=${url}&host=${host}&port=${port}&password=${password}`)
);

export const stop = (host?: string, port?: number, password?: string) => (
  getData(`${path}/stop?host=${host}&port=${port}&password=${password}`)
);

export const status = (host: string, port: string, password: string) => (
  getData(`${path}/status?host=${host}&port=${port}&password=${password}`)
);
