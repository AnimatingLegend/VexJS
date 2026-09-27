# Changelog

All notable changes to Vex.js are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `Docs`: Added [`CONTRIBUTING.md`](./docs/CONTRIBUTING.md) for Issue / PR templates.
- `Docs`: Added [`CODE_STYLE_GUIDE.md`](./docs/CODE_STYLE_GUIDE.md) for future contributors.
- `Chore(deps-dev)`: Added project tooling and package metadata.
  - Added `eslint` (`@eslint/js`, `globals`)
  - Added `serve`
  - Added `vitest`
- `VexSprite`: `animation` getter alias for `animationController`.

### Changed

- Clarified code comments in the `source/` directory.

### Fixed

- `VexSprite`: `draw()` referenced `this.animation` instead of `this.animationController`.
- `VexSprite`: `draw()` using `frame.w`/`frame.h` instead of `frame.width`/`frame.height`, throwing `DOMException` on spritesheet draws.
- `VexSprite`: `anglularAcceleration` typo -> `angularAcceleration`.
- `VexCamera`: Removed duplicate `_flashAlpha` initialization in the constructor.
  - Added the missing `_fadeAlpha` initialization.

---

## [1.0.0] - [2026-09-25]

### Added

- `Core`:
  - VexAnimationController
  - VexEmitter
  - VexText
  - VexTilemap
  - VexSound
  - VexTween
  - VexBasic
  - VexCamera
  - VexGame
  - VexGlobal
  - VexGroup
  - VexSignal
  - VexSprite
  - VexState
- `Loop`: Fixed-timestep game loop.
- `Sprite`: Drag-limited acceleration integration for motion.

```js
sprite.acceleration.x = 800;
sprite.drag.x = 600;
sprite.maxVelocity.x = 200;
```

- `Animation`: Spritesheet-based frame animation.

```js
sprite.animation.add("run", [0, 1, 2, 3], 12, true);
sprite.animation.play("run");
```

- `Camera`: Follow, Flash, & Fade functions.

```js
camera.follow(player);
camera.flash(0.2, 0xff0000);
camera.fade(1, 0.5, () => console.log("done"));
```

- `Camera`: Follow Modes - `lock` (instant, Mario-style) & `lerp` (smoothed chase, Sonic-Style).

```js
camera.follow(player); // lock (default)
camera.follow(player, { mode: "lerp", lerp: 0.1 }); // smoothed chase
```

- `Input`: Keyboard/Mouse input via VexGlobal

```js
if (VexGlobal.keys.justPressed("Space")) player.velocity.y = -320;
if (VexGlobal.mouse.justPressed) {
  /* ... */
}
```

- `Tween`: Tween manager with basic easing curves.

```js:
VexTween.tween(sprite, { x: 300 }, 1, { ease: Tween.Easing.quadOut });
```

- `Tilemap`: CSV-based map parsing and camera-culled rendering.

```js
const tilemap = new VexTilemap(0, 0);
await tilemap.loadMapFromCSV(csvData, "tileset.png", 32, 32);
this.add(tilemap);
```

- `Sound`: Background music streaming and volume via `VexSound`.

```js
const music = VexGlobal.playMusic("vexTheme.wav");
if (music !== null) music.fadeIn(2, 0.8);
VexGlobal.stopMusic(2); // Smoothly fades out over 2 seconds.
```

- `PlayState`:
  - [Gameplay Demo](./test/gameplay/PlayState.js) with gravity, platform collision, & camera follow.
  - [Click Counter Demo](./test/text/PlayState.js) with live text rendering, and particle spawning.
  - [Tilemap Demo](./test/tilemap/PlayState.js) with CSV level loading & camera-culled tile rendering.
  - [Sound Demo](./test/sound/PlayState.js) with background music playback, looping, and volume fading.
- `Deps`: `package-lock.json` for reproducible installs.

### Changed

- `CI`: Removed `npm test` from the workflow, (no test suite exists yet; it was running the dev server & hanging.)

### Fixed

- `PlayState(temp)`: Score incrementing on any click instead of only clicks inside the target's sprite's bounds.
- `Camera`: Vertical centering using sprite width instead of height.
- `Sprite`: Draw position double-applying `camera.scroll`, causing drift instead of a locked view.
- `Loop`: Fixed timestep accumulator incrementing instead of decrementing, freezing the game.
- `PlayState`: Inverted platform collision logic causing the player to never fall.
- `Text`: Missing `ctx.fillText()` call in VexText's draw method.
- `CI`: Fixed Node.js CI from failing on every push due to missing `package-lock.json`.
