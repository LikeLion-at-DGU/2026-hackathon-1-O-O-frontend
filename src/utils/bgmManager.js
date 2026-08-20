export class BgmManager {
  static audio = new Audio("/bgm.mp3");

  static isInitialized = false;

  static init() {
    if (!this.isInitialized) {
      this.audio.loop = true;
      this.isInitialized = true;
    }
  }

  static play() {
    this.init();
    return this.audio.play();
  }

  static pause() {
    this.audio.pause();
  }
}
