import { getData, page, post, postParams } from '../helper/service-helper';

const path = '/lighting';

export const getCurrentState = (ip) => getData(`${path}/currentState?ip=${ip}`);
export const getPresets = (ip) => getData(`${path}/presets?ip=${ip}`);
export const applyPreset = (ip, name) => getData(`${path}/applyPreset?ip=${ip}&name=${name}`);
export const powerOn = (ip) => getData(`${path}/powerOn?ip=${ip}`);
export const reset = (ip) => getData(`${path}/reset?ip=${ip}`);
export const powerOff = (ip) => getData(`${path}/powerOff?ip=${ip}`);
export const discover = () => getData(`${path}/discover`);

export const createSegment = (ip, start, stop) => {
  return getData(`${path}/createSegment?ip=${ip}&start=${start}&stop=${stop}`);
};

export const removeSegment = (ip, start, stop) => {
  return getData(`${path}/removeSegment?ip=${ip}&start=${start}&stop=${stop}`);
};

export const setEffect = (ip, effect, palette, start, stop) => {
  return getData(`${path}/setEffect?ip=${ip}&effect=${effect}&palette=${palette}&start=${start}&stop=${stop}`);
};

export const demoEffect = (ip, effect, palette, start, stop, speed, brightness) => {
  return getData(`${path}/demoEffect?ip=${ip}&effect=${effect}&palette=${palette}&start=${start}&stop=${stop}&speed=${speed}&brightness=${brightness}`);
};

export const applyEventSegments = (ip, eventSegments) => {
  return post(`${path}/applyEventSegments?ip=${ip}`, postParams({ eventSegments }));
};

export const setSolidColor = (ip, rgbColor, start, stop) => {
  return getData(`${path}/setSolidColor?ip=${ip}&rgbColor=${rgbColor}&start=${start}&stop=${stop}`);
};
