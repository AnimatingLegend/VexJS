/**
 * @file VexBasic.js
 *
 * Base class for objects managed by the game loop.
 * Empty lifecycle hooks let subclasses implement only the behavior they need.
 */
export default class VexBasic {
  constructor() {
    this.exists = true;
    this.active = true;
    this.visible = true;
    this.alive = true;
    this.ID = -1;
  }

  // Empty hooks keep each lifecycle stage optional for subclasses.
  update(dt) {}

  draw(ctx, camera) {}

  destroy() {}

  kill() {
    this.alive = false;
    this.exists = false;
  }

  revive() {
    this.alive = true;
    this.exists = true;
  }
}
