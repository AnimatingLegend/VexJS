import VexBasic from "./VexBasic.js";
import VexGlobal from "./VexGlobal.js";
import VexAnimationController from "./animation/VexAnimationController.js";

/**
 * @file VexSprite.js
 *
 * Represents a movable, drawable game object. It combines motion and image
 *  animation so common 2D behavior can be reused by game entities.
 */
export default class VexSprite extends VexBasic {
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;

    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.drag = { x: 0, y: 0 };
    this.maxVelocity = { x: 10000, y: 10000 };

    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.angularDrag = 0;
    this.maxAngular = 10000;

    this.scale = { x: 1, y: 1 };
    this.flipX = false;
    this.flipY = false;
    this.alpha = 1;
    this.scrollFactor = { x: 1, y: 1 };
    this.offset = { x: 0, y: 0 };

    this.image = null;
    this.animationController = new VexAnimationController(this);

    // A color fallback keeps sprites usable before an image is loaded.
    this.color = "#ffffff";
  }

  get animation() {
    return this.animationController;
  }

  async loadGraphic(path, frameWidth = 0, frameHeight = 0) {
    this.image = await VexGlobal.loadImage(path);
    this.width = frameWidth || this.image.width;
    this.height = frameHeight || this.image.height;
    if (frameWidth && frameHeight) {
      this.animationController._setupSheet(this.image, frameWidth, frameHeight);
    }
    return this;
  }

  makeGraphic(width, height, color = "#ffffff") {
    this.width = width;
    this.height = height;
    this.color = color;
    this.image = null;
    return this;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this; // Allow for method chaining
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    return this; // Allow for method chaining
  }

  // Average old and new velocity to reduce position error during acceleration.
  _updateMotion(dt) {
    // Keep horizontal motion independent so it can use its own drag and speed limit.
    const vx = this._computeVelocity(
      this.velocity.x,
      this.acceleration.x,
      this.drag.x,
      this.maxVelocity.x,
      dt,
    );
    // Vertical motion has separate settings, allowing different movement behavior per axis.
    const vy = this._computeVelocity(
      this.velocity.y,
      this.acceleration.y,
      this.drag.y,
      this.maxVelocity.y,
      dt,
    );
    this.x += (this.velocity.x + vx) * 0.5 * dt;
    this.y += (this.velocity.y + vy) * 0.5 * dt;
    this.velocity.x = vx;
    this.velocity.y = vy;

    // Apply the same acceleration and drag rules to rotation as to linear motion.
    const va = this._computeVelocity(
      this.angularVelocity,
      this.angularAcceleration,
      this.angularDrag,
      this.maxAngular,
      dt,
    );
    this.angle += (this.angularVelocity + va) * 0.5 * dt;
    this.angularVelocity = va;
  }

  // Apply drag only without acceleration, then clamp velocity to avoid reversal or excess speed.
  _computeVelocity(velocity, acceleration, drag, max, dt) {
    if (acceleration !== 0) velocity += acceleration * dt;
    else if (drag !== 0) {
      const dragForce = drag * dt;
      if (velocity - dragForce > 0) velocity -= dragForce;
      else if (velocity + dragForce < 0) velocity += dragForce;
      else velocity = 0;
    }
    if (velocity !== 0) velocity = Math.max(Math.min(velocity, max), -max);
    return velocity;
  }

  update(dt) {
    this._updateMotion(dt);
    this.animationController.update(dt);
  }

  draw(ctx, camera) {
    if (!this.visible) return;
    const sx =
      this.x + camera.scroll.x * (1 - this.scrollFactor.x) - this.offset.x;
    const sy =
      this.y + camera.scroll.y * (1 - this.scrollFactor.y) - this.offset.y;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(sx + this.width / 2, sy + this.height / 2);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.scale(
      this.scale.x * (this.flipX ? -1 : 1),
      this.scale.y * (this.flipY ? -1 : 1),
    );

    if (this.image) {
      const frame = this.animationController.currentFrame;
      if (frame) {
        ctx.drawImage(
          this.image,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height,
        );
      } else {
        ctx.drawImage(
          this.image,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height,
        );
      }
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    ctx.restore();
  }

  // Axis-aligned bounds provide a fast collision check without shape calculations.
  overlaps(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  // The center is useful for targeting and other position-based calculations.
  getMidpoint() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }
}
