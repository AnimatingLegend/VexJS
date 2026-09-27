import { VexState, VexSprite, VexGroup, VexGlobal } from "../../index.js";

/**
 * @file PlayState.js
 *
 * A minimal "hello world" for Vex:
 * A player you move with arrow keys, gravity, a platform to land on,
 *  and a camera that follows you.
 */
export default class PlayState extends VexState {
  create() {
    this.player = new VexSprite(100, 100).makeGraphic(32, 32, "#ffffff");
    this.playerSpawn = { x: this.player.x, y: this.player.y }; // Remember where the character started.
    this.player.drag.x = 800;
    this.player.maxVelocity.x = 200;
    this.add(this.player);

    this.platforms = new VexGroup();
    const ground = new VexSprite(0, 400).makeGraphic(640, 40, "#446644");
    this.platforms.add(ground);
    const ledge = new VexSprite(300, 300).makeGraphic(150, 20, "#446644");
    this.platforms.add(ledge);
    this.add(this.platforms);

    this.gravity = 500;

    // Follow the player when moving with your arrow keys.
    VexGlobal.camera.follow(this.player, { mode: "lerp", lerp: 0.05 });
    // Little intro fade-in.
    VexGlobal.camera.fade("#000000", 0.5, true);
  }

  update(dt) {
    super.update(dt);
    VexGlobal.camera.update(dt);

    const player = this.player;
    player.acceleration.x = 0;

    if (VexGlobal.keys.pressed("ArrowLeft")) player.acceleration.x = -800;
    if (VexGlobal.keys.pressed("ArrowRight")) player.acceleration.x = 800;

    player.acceleration.y = this.gravity;

    if (VexGlobal.keys.pressed("Space") && this._onGround())
      player.velocity.y = -320;

    // If the players gravity exceeds 1000, respawn the player back to its original place.
    if (player.y > 1000) {
      VexGlobal.camera.fade("#000000", 0.5, true);
      this._respawnCharacter();
    }

    this._resolvePlatformCollision();
  }

  _onGround() {
    let grounded = false;
    this.platforms.forEachAlive((platform) => {
      if (
        this.player.overlaps(platform) &&
        this.player.y + this.player.height <= platform.y + 10
      ) {
        grounded = true;
      }
    });
    return grounded;
  }

  _respawnCharacter() {
    this.player.x = this.playerSpawn.x;
    this.player.y = this.playerSpawn.y;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
  }

  _resolvePlatformCollision() {
    this.platforms.forEachAlive((platform) => {
      if (!this.player.overlaps(platform)) return;
      // Simple top-of-platform collision resolution
      if (this.player.velocity.y >= 0) {
        this.player.y = platform.y - this.player.height;
        this.player.velocity.y = 0;
      }
    });
  }
}
