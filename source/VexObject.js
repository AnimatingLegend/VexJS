import VexBasic from "./VexBasic.js";
import VexGlobal from "./VexGlobal.js";

/**
 * @file VexObject.js
 *
 * @description A base class for all game objects that handles collsion detection and basic motion for sprites,
 *  and particles.
 */
export default class VexObject extends VexBasic {
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

    this.last = { x: x, y: y };
    this.touching = { left: false, right: false, up: false, down: false };
    this.immovable = false;
  }

  /**
   * Checks if two objects are overlapping with each other, and resolves it if they are.
   * @param objA - The first object to check for collision.
   * @param objB - The second object to check for collision.
   * @returns {void}
   */
  static collide(objA, objB) {
    if (!objA.overlaps(objB)) return;

    const wasOverlappingX =
      objA.last.x < objB.last.x + objB.width &&
      objA.last.x + objA.width > objB.last.x;
    const wasOverlappingY =
      objA.last.y < objB.last.y + objB.height &&
      objA.last.y + objA.height > objB.last.y;

    if (wasOverlappingX && !wasOverlappingY) {
      // Handle vertical collision
      const objAIsAbove = objA.last.y < objB.last.y;
      const overlap = objAIsAbove
        ? objA.y + objA.height - objB.y
        : objB.y + objB.height - objA.y;

      if (objAIsAbove) {
        objA.touching.down = true;
        objB.touching.up = true;
      } else {
        objA.touching.up = true;
        objB.touching.down = true;
      }

      const push = objAIsAbove ? -overlap : overlap;
      if (objB.immovable && !objA.immovable) {
        objA.y += push;
        objA.velocity.y = 0;
      } else if (!objB.immovable && objA.immovable) {
        objB.y -= push;
        objB.velocity.y = 0;
      } else if (!objB.immovable && !objA.immovable) {
        objA.y += push / 2;
        objB.y -= push / 2;
        objA.velocity.y = 0;
        objB.velocity.y = 0;
      }
    } else {
      const objAIsLeft = objA.last.x < objB.last.x;
      const overlap = objAIsLeft
        ? objA.x + objA.width - objB.x
        : objB.x + objB.width - objA.x;

      if (objAIsLeft) {
        objA.touching.right = true;
        objB.touching.left = true;
      } else {
        objA.touching.left = true;
        objB.touching.right = true;
      }

      const push = objAIsLeft ? -overlap : overlap;
      if (objB.immovable && !objA.immovable) {
        objA.x += push;
        objA.velocity.x = 0;
      } else if (!objB.immovable && objA.immovable) {
        objB.x -= push;
        objB.velocity.x = 0;
      } else if (!objB.immovable && !objA.immovable) {
        objA.x += push / 2;
        objB.x -= push / 2;
        objA.velocity.x = 0;
        objB.velocity.x = 0;
      }
    }
  }

  /**
   * Axis-aligned bounds provide a fast collision check without shape calculations.
   * @param {VexObject} other - The other object to check for overlap with.
   * @returns {boolean} - True if the objects overlap, false otherwise.
   */
  overlaps(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  /**
   * Positions the object at the center of the screen along a specifed axes.
   * @param {String} axes - A string containing the axes to center the object on ("X", "Y", or "XY").
   * @returns {vexObject}
   */
  screenCenter(axes = "xy") {
    const a = axes.toLowerCase();
    if (a.includes("x")) this.x = VexGlobal.width / 2 - this.width / 2;
    if (a.includes("y")) this.y = VexGlobal.height / 2 - this.height / 2;
    return this;
  }

  /**
   * Average old and new velocity to reduce position error during acceleration.
   * @param {number} dt - The delta time since the last update.
   * @return {void}
   */
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

  /**
   * Apply drag only without acceleration, then clamp velocity to avoid reversal or excess speed.
   * @param {number} velocity - The current velocity of the object.
   * @param {number} acceleration - The current acceleration of the object.
   * @param {number} drag - The drag applied to the object.
   * @param {number} max - The maximum velocity of the object.
   * @param {number} dt - The delta time since the last update.
   * @returns {number} - The new velocity of the object.
   */
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

  // The center is useful for targeting and other position-based calculations.
  getMidpoint() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }

  update(dt) {
    this.last.x = this.x;
    this.last.y = this.y;
    this.touching.up = false;
    this.touching.down = false;
    this.touching.left = false;
    this.touching.right = false;

    this._updateMotion(dt);
  }
}
