import VexTween from "./tweens/VexTween.js";
import VexCamera from "./VexCamera.js";
import VexGlobal from "./VexGlobal.js";

/**
 * @file VexGame.js
 *
 * Runs the game loop and coordinates updates and drawing. Fixed-step updates
 *  keep game behavior consistent across different display frame rates.
 */
export default class VexGame {
  constructor({
    width = 640,
    height = 480,
    canvas = null,
    container = null,
    initialState,
    framerate = 60,
  } = {}) {
    this.canvas = canvas || document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    if (!canvas && container) {
      const parent =
        typeof container === "string"
          ? document.querySelector(container)
          : container;
      if (parent) parent.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");

    VexGlobal.width = width;
    VexGlobal.height = height;
    VexGlobal.camera = new VexCamera(width, height);

    this.step = 1 / framerate;
    this._accumulator = 0;
    this._lastTime = 0;
    this._running = false;

    this._bindInput();

    VexGlobal.switchState(initialState);
  }

  // Global release listeners keep input state correct when events end outside the canvas.
  _bindInput() {
    window.addEventListener("keydown", (e) => VexGlobal.keys._onKeyDown(e));
    window.addEventListener("keyup", (e) => VexGlobal.keys._onKeyUp(e));

    this.canvas.addEventListener("mousemove", (e) =>
      VexGlobal.mouse._onMove(e, this.canvas),
    );
    this.canvas.addEventListener("mousedown", () => VexGlobal.mouse._onDown());
    window.addEventListener("mouseup", () => VexGlobal.mouse._onUp());
  }

  // Reset the clock so restarting does not simulate time spent while stopped.
  start() {
    this._running = true;
    this._lastTime = performance.now();
    requestAnimationFrame(this._loop.bind(this));
  }

  // Let the pending animation frame exit without scheduling another one.
  stop() {
    this._running = false;
  }

  // Run fixed simulation steps while rendering once for each browser frame.
  _loop(now) {
    if (!this._running) return;

    // Limit catch-up work after a paused or stalled frame.
    const frameTime = Math.min(0.25, (now - this._lastTime) / 1000);
    this._lastTime = now;
    this._accumulator += frameTime;

    // Fixed steps keep physics consistent across display frame rates.
    while (this._accumulator >= this.step) {
      this._update(this.step);
      this._accumulator -= this.step;
    }

    this._draw();
    requestAnimationFrame(this._loop.bind(this));
  }

  _update(dt) {
    VexGlobal.elapsed = dt;
    if (VexGlobal.state) VexGlobal.state.update(dt);
    VexGlobal.camera.update(dt);
    VexTween.updateTweens(dt);
    VexGlobal.keys._endFrame();
    VexGlobal.mouse._endFrame();
  }

  _draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, VexGlobal.width, VexGlobal.height);
    VexGlobal.camera.applyTransform(ctx);
    if (VexGlobal.state) VexGlobal.state.draw(ctx, VexGlobal.camera);
    VexGlobal.camera.restoreTransform(ctx);
    VexGlobal.camera.drawOverlays(ctx);
  }
}
