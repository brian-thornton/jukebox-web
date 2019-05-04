class VolumeClient {
  static async up() {
    const response = await fetch('/volume/up');
    return response;
  }

  static async down() {
    const response = await fetch('/volume/down');
    return response;
  }
}

module.exports = VolumeClient;
