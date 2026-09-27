import VexSound from "./sound/VexSound.js";

/**
 * @file VexGlobal.js
 *
 * Shared access to input, screen size, the active camera, and cached assets.
 * One object keeps these resources available across engine modules.
 */
const VexGlobal = {
  width: 0,
  height: 0,
  camera: null,
  state: null,
  elapsed: 0,

  keys: {
    _down: new Set(),
    _justPressed: new Set(),
    _justReleased: new Set(),

    pressed(code) {
      return this._down.has(code);
    },
    justPressed(code) {
      return this._justPressed.has(code);
    },
    justReleased(code) {
      return this._justReleased.has(code);
    },
    // Clear one-frame flags after updates so input events last exactly one frame.
    _endFrame() {
      this._justPressed.clear();
      this._justReleased.clear();
    },
    _onKeyDown(e) {
      if (!this._down.has(e.code)) this._justPressed.add(e.code);
      this._down.add(e.code);
    },
    _onKeyUp(e) {
      this._down.delete(e.code);
      this._justReleased.add(e.code);
    },
  },

  mouse: {
    x: 0,
    y: 0,
    pressed: false,
    justPressed: false,
    justReleased: false,

    _onMove(e, canvas) {
      const rect = canvas.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
    },
    _onDown() {
      this.pressed = true;
      this.justPressed = true;
    },
    _onUp() {
      this.pressed = false;
      this.justReleased = true;
    },
    _endFrame() {
      this.justPressed = false;
      this.justReleased = false;
    },
  },

  // Reuse audio resources for repeated requests of the same URL.
  music: null,
  _soundCache: new Map(),

  // Share one loaded audio resource for repeated requests of the same path.
  loadSound(path) {
    if (this._soundCache.has(path)) return this._soundCache.get(path);
    const audio = new VexSound(path);
    this._soundCache.set(path, audio);
    return audio;
  },

  // Give each playback its own audio node so effects can overlap.
  playSound(path, volume = 1) {
    const base = this.loadSound(path);
    const instance = new VexSound();
    instance.audio = base.audio.cloneNode();
    instance.volume = volume;
    instance.play();
    return instance;
  },

  // Keep background music exclusive so a new track replaces the current one.
  playMusic(path, volume = 1, loop = true) {
    if (this.music) this.music.stop();
    this.music = new VexSound(path);
    this.music.loop = loop;
    this.music.volume = volume;
    this.music.play();
    return this.music;
  },

  // Support both immediate stops and smoother transitions between tracks.
  stopMusic(fadeOut = 0) {
    if (!this.music) return;
    if (fadeOut > 0) this.music.fadeOut(fadeOut);
    else this.music.stop();
  },

  // Reuse loaded images so repeated requests do not fetch them again.
  _imageCache: new Map(),

  // Cache the in-flight promise so concurrent requests share one image load.
  async loadImage(path) {
    if (this._imageCache.has(path)) return this._imageCache.get(path);
    const img = new Image();
    const promise = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
    img.src = path;
    this._imageCache.set(path, promise);
    return promise;
  },

  // Release the current state's objects before the next state takes ownership.
  switchState(newState) {
    if (this.state) this.state.destroy();
    this.state = newState;
    this.state.create();
  },
};

export default VexGlobal;
