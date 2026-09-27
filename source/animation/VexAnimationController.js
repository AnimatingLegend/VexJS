/**
 * @file VexAnimationController.js
 *
 * Plays named frame sequences from a spritesheet. Storing frame indices keeps
 *  animations small and lets multiple sequences share the same image frames.
 */
export default class VexAnimationController {
  constructor(sprite) {
    this.sprite = sprite;
    this._frames = [];
    this._animations = new Map();
    this._current = null;
    this._frameIndex = 0;
    this._elapsed = 0;
    this.currentFrame = null;
    this.finished = false;
  }

  // Precompute frame rectangles so playback only needs to select an index.
  _setupSheet(image, frameWidth, frameHeight) {
    this._frames = [];
    const cols = Math.floor(image.width / frameWidth);
    const rows = Math.floor(image.height / frameHeight);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this._frames.push({
          x: c * frameWidth,
          y: r * frameHeight,
          width: frameWidth,
          height: frameHeight,
        });
      }
    }
  }

  /**
   * Give the character a frame name, get its indices, set the framerate of the animation,
   *  and determine whether the animation is looped.
   *
   * Usage:
   * VexAnimationController.add("run", [0,1,2,3], 12, true)
   */
  add(name, frameIndices, framerate = 12, looped = true) {
    this._animations.set(name, { frames: frameIndices, framerate, looped });
  }

  /**
   * Play the characters animation.
   *
   * Usage:
   * VexAnimationController.play("run", true)
   */
  play(name, force = false) {
    if (this._current === name && !force) return;
    if (!this._animations.has(name)) return;
    this._current = name;
    this._frameIndex = 0;
    this._elapsed = 0;
    this.finished = false;
    this._applyFrame();
  }

  // Resolve the animation index once so the renderer can use the current frame directly.
  _applyFrame() {
    const anim = this._animations.get(this._current);
    if (!anim) return;
    const frameNum = anim.frames[this._frameIndex];
    this.currentFrame = this._frames[frameNum] || null;
  }

  update(dt) {
    if (!this._current) return;
    const anim = this._animations.get(this._current);
    if (!anim || this.finished) return;

    this._elapsed += dt;
    const frameDuration = 1 / anim.framerate;
    // Consume all elapsed frame intervals so a delayed update does not lose animation time.
    while (this._elapsed >= frameDuration) {
      this._elapsed -= frameDuration;
      this._frameIndex++;
      if (this._frameIndex >= anim.frames.length) {
        if (anim.looped) this._frameIndex = 0;
        else {
          this._frameIndex = anim.frames.length - 1;
          this.finished = true;
          break;
        }
      }
    }
    this._applyFrame();
  }
}
