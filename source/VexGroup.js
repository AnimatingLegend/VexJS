import VexBasic from "./VexBasic.js";

/**
 * @file VexGroup.js
 *
 * Holds game objects and forwards their lifecycle calls.
 * Recycling members lets effects reuse objects instead of allocating new ones repeatedly.
 */
export default class VexGroup extends VexBasic {
  constructor(maxSize = 0) {
    super();
    this.members = [];
    // Zero keeps capacity unrestricted when the group is not used as a pool.
    this.maxSize = maxSize;
  }

  // Prevent duplicate entries from receiving lifecycle calls more than once.
  add(object) {
    const existingIndex = this.members.indexOf(object);
    if (existingIndex !== -1) return object;
    if (this.maxSize > 0 && this.members.length >= this.maxSize) return object;

    this.members.push(object);
    return object;
  }

  // Return the reference so callers can keep using the removed object.
  remove(object) {
    const i = this.members.indexOf(object);
    if (i !== -1) this.members.splice(i, 1);
    return object;
  }

  // Reuses a dead member if one exists.
  // Otherwise, constructs a new one with factoryFn.
  recycle(factoryFn) {
    let member = this.members.find((m) => !m.exists);
    if (!member) {
      if (this.maxSize > 0 && this.members.length >= this.maxSize) return null;
      member = factoryFn();
      this.members.push(member);
    }
    return member;
  }

  // Ignore dead pool slots so callbacks only receive existing objects.
  forEach(fn) {
    this.members.forEach((m) => {
      if (m.exists) fn(m);
    });
  }

  // Return the first living member or null if none exist.
  getFirstAlive() {
    console.log(this.members);
    return this.members.find((m) => m.exists && m.alive) || null;
  }

  // Return the first dead member or null if none exist.
  getFirstDead() {
    console.log(this.members);
    return this.members.find((m) => !m.exists) || null;
  }

  // Exclude dead members so pooled objects are treated as inactive.
  countDead() {
    return this.members.filter((m) => !m.exists).length;
  }

  // Exclude dead members so pooled objects are treated as inactive.
  forEachAlive(fn) {
    this.members.forEach((m) => {
      if (m.exists && m.alive) fn(m);
    });
  }

  update(dt) {
    this.members.forEach((m) => {
      if (m.exists && m.active) m.update(dt);
    });
  }

  draw(ctx, camera) {
    this.members.forEach((m) => {
      if (m.exists && m.visible) m.draw(ctx, camera);
    });
  }

  // Exclude dead pool entries so the count reflects active game objects.
  countLiving() {
    return this.members.filter((m) => m.exists && m.alive).length;
  }

  clear() {
    this.members.length = 0;
  }

  destroy() {
    this.members.forEach((m) => m.destroy());
    this.members.length = 0;
  }
}
