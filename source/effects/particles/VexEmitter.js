import VexGroup from "../../VexGroup.js";
import VexSprite from "../../VexSprite.js";

/**
 * @file VexEmitter.js
 *
 * Spawns short-lived particles and reuses them through VexGroup recycling to
 *  avoid repeated allocations during bursts.
 */
export default class VexEmitter extends VexGroup {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;

    this.lifeSpan = 0.6;
  }

  // Reuse pooled particles so repeated bursts do not allocate new sprites.
  emit() {
    const particle = this.recycle(() =>
      new VexSprite(this.x, this.y).makeGraphic(4, 4, "#ffaa00"),
    );
    particle.x = this.x;
    particle.y = this.y;
    // Spread particles horizontally so a burst does not stack in one column.
    particle.velocity.x = (Math.random() - 0.5) * 200;
    // Negative y moves upward in canvas coordinates.
    particle.velocity.y = -Math.random() * 200;
    particle.lifeSpan = this.lifeSpan;
    particle.age = 0;
  }

  update(dt) {
    super.update(dt);
    this.forEachAlive((particle) => {
      particle.age += dt;
      if (particle.age >= particle.lifeSpan) particle.kill();
    });
  }
}
