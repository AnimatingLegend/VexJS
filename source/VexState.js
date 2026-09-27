import VexBasic from "./VexBasic.js";
import VexGroup from "./VexGroup.js";

/**
 * @file VexState.js
 *
 * Represents a game screen or scene. A root group centralizes object updates
 *  and drawing, while subclasses provide state-specific setup.
 */
export default class VexState extends VexBasic {
  constructor() {
    super();
    this._group = new VexGroup();
    this.subState = null;
  }

  // Keep state objects in the root group so updates and drawing stay centralized.
  add(object) {
    return this._group.add(object);
  }

  // Delegate removal to the root group to preserve a single ownership path.
  remove(object) {
    return this._group.remove(object);
  }

  // Keep setup optional so simple states need no extra implementation.
  create() {}

  // Give menus and overlays their own lifecycle without replacing the parent state.
  openSubState(subState) {
    this.subState = subState;
    subState.create();
  }

  // Destroy the overlay first so it can release resources before being detached.
  closeSubState() {
    if (this.subState) this.subState.destroy();
    this.subState = null;
  }

  update(dt) {
    if (this.subState) {
      this.subState.update(dt);
      return;
    }
    this._group.update(dt);
  }

  draw(ctx, camera) {
    this._group.draw(ctx, camera);
    if (this.subState) this.subState.draw(ctx, camera);
  }

  destroy() {
    this._group.destroy();
  }
}
