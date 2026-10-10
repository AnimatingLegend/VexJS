// Keep easing curves reusable so tween timing can change without changing update logic.
const Easing = {
  bounceOut: (tmr) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (tmr < 1 / d1) {
      return n1 * tmr * tmr;
    } else if (tmr < 2 / d1) {
      return n1 * (tmr -= 1.5 / d1) * tmr + 0.75;
    } else if (tmr < 2.5 / d1) {
      return n1 * (tmr -= 2.25 / d1) * tmr + 0.9375;
    } else {
      return n1 * (tmr -= 2.625 / d1) * tmr + 0.984375;
    }
  },
  cubicIn: (tmr) => tmr * tmr * tmr,
  cubicOut: (tmr) => --tmr * tmr * tmr + 1,
  linear: (tmr) => tmr,
  quadIn: (tmr) => tmr * tmr,
  quadOut: (tmr) => tmr * (2 - tmr),
  quadInOut: (tmr) => (tmr < 0.5 ? 2 * tmr * tmr : -1 + (4 - 2 * tmr) * tmr),
  sineIn: (tmr) => 1 - Math.cos((tmr * Math.PI) / 2),
  sineOut: (tmr) => Math.sin((tmr * Math.PI) / 2),
  sineInOut: (tmr) => 0.5 * (1 - Math.cos(Math.PI * tmr)),
};

/**
 * @file VexTween.js
 *
 * Animates object properties over time.
 * A shared manager lets the game advance active tweens centrally on each update.
 */
class VexTween {
  constructor(target, properties, duration, options = {}) {
    this.target = target;
    this.duration = duration;
    this.ease = options.ease || Easing.linear;
    this.onComplete = options.onComplete || null;
    this.elapsed = 0;
    this.done = false;

    this._from = {};
    this._to = properties;
    Object.keys(properties).forEach((key) => {
      this._from[key] = target[key];
    });
  }

  update(dt) {
    if (this.done) return;
    this.elapsed += dt;
    const tmr = Math.min(1, this.elapsed / this.duration);
    const eased = this.ease(tmr);
    Object.keys(this._to).forEach((key) => {
      const from = this._from[key];
      const to = this._to[key];
      this.target[key] = from + (to - from) * eased;
    });
    if (tmr >= 1) {
      this.done = true;
      if (this.onComplete) this.onComplete();
    }
  }
}

// A shared list lets VexGame advance tweens without owning each one.
const activeTweens = [];

// Return the tween handle so callers can track its completion.
function tween(target, properties, duration, options = {}) {
  const tmr = new VexTween(target, properties, duration, options);
  activeTweens.push(tmr);
  return tmr;
}

// Iterate backward so completed tweens can be removed without skipping entries.
function updateTweens(dt) {
  for (let i = activeTweens.length - 1; i >= 0; i--) {
    activeTweens[i].update(dt);
    if (activeTweens[i].done) activeTweens.splice(i, 1);
  }
}

// Cancel updates when another action takes control of the same target.
function cancelTweensOf(target) {
  for (let i = activeTweens.length - 1; i >= 0; i--) {
    if (activeTweens[i].target === target) activeTweens.splice(i, 1);
  }
}

export default { tween, updateTweens, cancelTweensOf, Easing };
