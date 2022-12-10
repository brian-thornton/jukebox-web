import { updateSettings } from './settings-client';

export const updatePreference = async (settings, preferenceName, value, target) => {
  const deepClone = JSON.parse(JSON.stringify(settings));
  deepClone.preferences[preferenceName] = value;
  updateSettings(deepClone).then(() => {
    if (target) {
      window.location.replace(target);
    }
  });
};
