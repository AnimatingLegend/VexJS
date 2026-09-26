# Vex.js Programming Style Guide

> [!WARNING]
>
> This document is inspired by the [Funkin' Repo Code Style Guide](https://github.com/FunkinCrew/Funkin/blob/main/docs/style-guide.md).
>
> Though this project is inspired by [Haxeflixel](https://github.com/HaxeFlixel/flixel), it was written using Node.js and other libraries.

## Purpose

This document explains how code should be written and maintained for Vex.js, The goal is **consistency**, **readability**, and **easy maintenance**.

## General rules

- Stay consistent within files.
- Avoid unnecessary complexity.
  - If your code is/looks confusing, clean it up, or explaining its functionality using **[code comments](#code-comments)**.
- Match the patterns already used elsewhere in the engine, rather than introducing a new style for the same kind of problem.

## Variable and Function Names

It is recommended to name your variables and functions with descriptive titles, in `lowerCamelCase`, and `snake_case`.

### Example:

```js
// lowerCamelCase should be used for generic vars / functions.
let playerScore = 0;
function updateMotion(dt) { ... }

// snake_case should ONLY be used for constants.
const MAX_VELOCITY = 10000;
```

## Code Comments

- Every class file starts with a short block comment: the filename, then what the class does and why it's built that way.
- Inline `//` comments explain **why** a piece of code exists or works the way it does, not **what** is does; the code itself already shows what it does.

### Example:

```js
/**
 * @file VexCamera.js
 *
 * Scroll offset, zoom, and flash/fade screen effets.
 *  Sprites read `scrollFactor` this to get parallax.
 */
export default class VexCamera  {
  constructor() { ... }

  // Called when you want the camera to follow a specified object.
  follow(target, options = {}) { ... }
}
```

> [!IMPORTANT]
>
> **DO NOT** create unsed comments, OR comment out unused sections of code. Keep those snippets anywhere else, or remove them.

## Imports

In `source/`, class imports should be placed in a single group, alphabetical order, at the top of the code file. The only exception is conditional imports, which should ALWAYS be placed at the end of the list.

### Example:

```js
import VexBasic from "./VexBasic.js";
import VexCamera from "./VexCamera.js";
import VexConstants from "./utils/VexConstants.js";
import VexGroup from "./VexGroup.js";
// Conditional imports go last, after the alphabetical block.
if (VexConstants.DEBUG) {
  import("./debug/VexDebugOverlay.js");
}
```

## Argument Formatting

- Required arguments are positional, in order of importance (e.g. position before configuration): `new VexSprite(x, y)`.
- Once a function needs more than two optional arguments, or arguments a caller would only sometimes set, use a single trailing `options` object instead of adding more positional parameters.
- Give every `options` field a sensible default using `??` or `||`, so callers only need to specify what they're changing.

### Example:

```js
// Two or fewer required args: plain positional parameters.
constructor(x = 0, y = 0) { /* ... */ }

// Optional, situational settings: a trailing options object.
follow(target, options = {}) {
  this.followMode = options.mode || 'lock';
  this.followLerp = options.lerp ?? 0.1;
}
```
