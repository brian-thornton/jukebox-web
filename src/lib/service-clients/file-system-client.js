import { getData } from '../helper/service-helper';

const path = '/file-service';
export const getDirectories = (dir = '/') => (
  getData(`${path}/directories?path=${dir}`)
);
