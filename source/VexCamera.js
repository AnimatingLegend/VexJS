/**
 * @file VexCamera.js
 *
 * Controls world scrolling, zoom, and screen fades.
 * Keeping camera movement separate lets objects use different scroll factors for parallax.
 */
export default class VexCamera {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.scroll = { x: 0, y: 0 };
    this.zoom = 1;
    this.target = null;
    this.deadzone = null;

    this._flashAlpha = 0;
    this._flashColor = "#ffffff";
    this._flashDuration = 0;
    this._flashElapsed = 0;
    this._flashOnComplete = null;

    this._fadeAlpha = 0;
    this._fadeColor = "#000000";
    this._fadeDuration = 0;
    this._fadeElapsed = 0;
    this._fadeOnComplete = null;
    this._fadeIn = false;
  }

  follow(target, options = {}) {
    this.target = target;
    this.deadzone = options.deadzone ?? null;
    // Choose immediate or eased tracking to match the game's camera feel.
    this.followMode = options.mode || "lock";
    this.followLerp = options.lerp ?? 0.1;
  }

  // Use a timed overlay for visual feedback without adding a scene object.
  flash(color = "#ffffff", duration = 0.5, onComplete = null) {
    this._flashColor = color;
    this._flashDuration = duration;
    this._flashElapsed = 0;
    this._flashAlpha = 1;
    this._flashOnComplete = onComplete;
  }

  // Fade the full screen independently of world objects during transitions.
  fade(color = "#000000", duration = 0.5, fadeIn = false, onComplete = null) {
    this._fadeColor = color;
    this._fadeDuration = duration;
    this._fadeElapsed = 0;
    this._fadeAlpha = fadeIn ? 1 : 0;
    this._fadeIn = fadeIn;
    this._fadeOnComplete = onComplete;
  }

  update(dt) {
    if (this.target) {
      const targetX =
        this.target.x + this.target.width / 2 - this.width / (2 * this.zoom);
      const targetY =
        this.target.y + this.target.height / 2 - this.height / (2 * this.zoom);

      if (this.followMode === "lerp") {
        this.scroll.x += (targetX - this.scroll.x) * this.followLerp;
        this.scroll.y += (targetY - this.scroll.y) * this.followLerp;
      } else {
        this.scroll.x = targetX;
        this.scroll.y = targetY;
      }
    }

    if (this._flashElapsed < this._flashDuration) {
      this._flashElapsed = dt;
      this._flashAlpha = Math.max(
        0,
        1 - this._flashElapsed / this._flashDuration,
      );
      if (this._flashElapsed >= this._flashDuration && this._flashOnComplete) {
        this._flashOnComplete();
        this._flashOnComplete = null;
      }
    }

    if (this._fadeElapsed < this._fadeDuration) {
      this._fadeElapsed += dt;
      const tmr = Math.min(1, this._fadeElapsed / this._fadeDuration);
      this._fadeAlpha = this._fadeIn ? 1 - tmr : tmr;
      if (this._fadeElapsed >= this._fadeDuration && this._fadeOnComplete) {
        this._fadeOnComplete();
        this._fadeOnComplete = null;
      }
    }
  }

  // Apply the world transform here so screen overlays can be drawn after it is restored.
  applyTransform(ctx) {
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.scroll.x, -this.scroll.y);
  }

  restoreTransform(ctx) {
    ctx.restore();
  }

  // Draw overlays after restoring the world transform so they cover the screen.
  drawOverlays(ctx) {
    if (this._flashAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this._flashAlpha;
      ctx.fillStyle = this._flashColor;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }
    if (this._fadeAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this._fadeAlpha;
      ctx.fillStyle = this._fadeColor;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }
  }
}
