import {
  VexGlobal,
  VexGroup,
  VexState,
  VexSprite,
  VexText,
} from "../../index.js";

/**
 * @file PlayState.js
 *
 * @description A minimal "hello world" for Vex.
 * @description A player you move with arrow keys, gravity, a platform to land on, and a camera that follows you.
 */
export default class PlayState extends VexState {
  create() {
    // Initialize the player sprite.
    this.player = new VexSprite()
      .makeGraphic(32, 32, "#ffffff")
      .setPosition(0, 450);
    // How much the player is slowed down when not moving.
    this.player.drag.x = 800;
    // How fast the player can move horizontally.
    this.player.maxVelocity.x = 200;
    // Remember where the character initially started.
    this.playerSpawn = { x: this.player.x, y: this.player.y };
    this.add(this.player);

    // Add a little camera fade-in effect when spawning.
    VexGlobal.camera.fade("#000000", 0.5, true);
    // Follow the player when moving.
    VexGlobal.camera.follow(this.player, { mode: "lerp", lerp: 0.05 });

    // Initialize the game level.
    this._buildLevel();
    this.levelGravity = 500;

    // Initalize the games HUD.
    this._buildHUD();
  }

  _buildLevel() {
    this.platformGrp = new VexGroup();
    var ground = new VexSprite(0, 500).makeGraphic(650, 50, "#446644");
    this.platformGrp.add(ground);
    var ledge = new VexSprite(300, 400).makeGraphic(180, 20, "#446644");
    this.platformGrp.add(ledge);
    this.add(this.platformGrp);
  }

  _buildHUD() {
    this.hud = new VexGroup();
    var descText = new VexText();
    descText.setText(
      "Use Arrow/WASD keys to move, Shift to sprint, & Space to jump.",
    );
    descText.setColor("#ffffff");
    descText.setFont("18px Comic Sans MS");
    descText.setColor("#ffffff");
    descText.setAlign("left");
    descText.x = 40;
    descText.y = 20;
    this.hud.add(descText);
    this.add(this.hud);
  }

  update(dt) {
    super.update(dt);
    VexGlobal.camera.update(dt);

    var player = this.player;
    player.acceleration.x = 0;
    player.acceleration.y = this.levelGravity;

    var isRunning =
      VexGlobal.keys.pressed("ShiftLeft") ||
      VexGlobal.keys.pressed("ShiftRight");
    var speed = isRunning ? 1000 : 800;
    // Boost both top speed, AND acceleration when running.
    player.maxVelocity.x = isRunning ? 300 : 100;

    if (VexGlobal.keys.pressed("ArrowLeft") || VexGlobal.keys.pressed("KeyA"))
      player.acceleration.x = -speed;
    if (VexGlobal.keys.pressed("ArrowRight") || VexGlobal.keys.pressed("KeyD"))
      player.acceleration.x = speed;

    if (
      VexGlobal.keys.pressed("ArrowUp") ||
      VexGlobal.keys.pressed("KeyW") ||
      VexGlobal.keys.pressed("Space")
    ) {
      if (this._isGrounded()) player.velocity.y = -320;
    }

    // If the players gravity exceeds 1000, respawn the player back to its original place.
    if (player.y > 1000) {
      VexGlobal.camera.fade("#000000", 0.5, true);
      this._respawnCharacter();
    }

    this._platformCollision();
  }

  _platformCollision() {
    this.platformGrp.forEachAlive((platform) => {
      if (!this.player.overlaps(platform)) return;

      // Calculate how deep the player is embedded in the platform.
      const depth = this.player.y + this.player.height - platform.y;
      // Allow snapped ONLY within a small entry window.
      const maxDepth = 12;
      const isLanding = depth > 0 && depth <= maxDepth;

      if (this.player.velocity.y >= 0 && isLanding) {
        // snap the player to the top of the platform and reset downard velocity.
        this.player.y = platform.y - this.player.height;
        this.player.velocity.y = 0;
      }
    });
  }

  _isGrounded() {
    var isGrounded = false;
    this.platformGrp.forEachAlive((platformGrp) => {
      // Check if the player is colliding with the platform from above.
      if (
        this.player.overlaps(platformGrp) &&
        this.player.y + this.player.height <= platformGrp.y + 10
      ) {
        isGrounded = true;
      }
    });
    return isGrounded;
  }

  _respawnCharacter() {
    this.player.x = this.playerSpawn.x;
    this.player.y = this.playerSpawn.y;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
  }
}
