import {
  VexEmitter,
  VexText,
  VexGlobal,
  VexGroup,
  VexObject,
  VexSprite,
  VexState,
} from "../../index.js";

/**
 * @file PlayState.js
 *
 * @description A minimal "hello world" for Vex:
 *  A player you move with arrow keys, gravity, a platform to land on, and a camera that follows you.
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

    // Add landing particles.
    this.landingDust = new VexEmitter(0, 0);
    this.landingDust.particleColor = "#714f00";
    this.add(this.landingDust);

    // Initalize the games HUD.
    this._buildHUD();
  }

  _buildLevel() {
    this.platformGrp = new VexGroup();
    var ground = new VexSprite(0, 500).makeGraphic(650, 50, "#446644");
    ground.immovable = true;
    this.platformGrp.add(ground);
    var ledge = new VexSprite(300, 400).makeGraphic(180, 20, "#446644");
    ledge.immovable = true;
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
    var player = this.player;
    var wasGrounded = player.touching.down;

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
      if (wasGrounded) player.velocity.y = -320;
    }

    super.update(dt);

    var fallSpeed = player.velocity.y;
    this._platformCollision();
    if (!wasGrounded && player.touching.down && fallSpeed > 100)
      this._landingEffect();

    VexGlobal.camera.update(dt);
    // If the players gravity exceeds 1000, respawn the player back to its original place.
    if (player.y > 1000) {
      VexGlobal.camera.fade("#000000", 0.5, true);
      this._respawnCharacter();
    }
  }

  _platformCollision() {
    this.platformGrp.forEachAlive((platform) => {
      if (!this.player.overlaps(platform)) return;
      VexObject.collide(this.player, platform);
    });
  }

  _landingEffect() {
    var landingDust = this.landingDust;
    landingDust.x = this.player.x + this.player.width / 2;
    landingDust.y = this.player.y + this.player.height;
    // pi = particle index
    for (var pi = 0; pi < 6; pi++) {
      landingDust.emit();
      landingDust.fadeParticle(0.12, 2.75, () => {
        console.log("VEX EMITTER: Landing dust emitted.");
      });
    }
  }

  _respawnCharacter() {
    this.player.x = this.playerSpawn.x;
    this.player.y = this.playerSpawn.y;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
  }
}
