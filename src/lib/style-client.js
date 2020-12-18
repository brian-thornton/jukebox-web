import { postParams } from './service-helper';

export default class StyleClient {
  static async getSkins() {
    const response = await fetch(`/styles/skins`);
    const json = await response.json();
    return json;
  }

  static async createSkin(skin) {
    console.log(skin);
    const response = await fetch('/styles/skins', postParams(skin));
    return response;
  }

  static async deleteSkin(name) {
    const response = await fetch('/styles/delete', postParams({ name }));
    return response;
  }
}
