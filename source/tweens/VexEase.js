/**
 * @file VexEase.js
 * @description Easing functions for smooth animations.
 */

// Keep easing curves reusable so tween timing can change without changing update logic.
const VexEase = {
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

export default VexEase;
