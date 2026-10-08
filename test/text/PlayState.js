import {
  VexState,
  VexSprite,
  VexGlobal,
  VexText,
  VexEmitter,
} from "../../index.js";

/**
 * @file PlayState.js
 *
 * @description A minimal "hello world" for Vex:
 *  Click on the block to add 50 points to your score.
 */
export default class PlayState extends VexState {
  create() {
    this.descText = new VexText(100, 100, "Click on the block!")
      .setFont("20px Courier New")
      .setBold(true)
      .setColor("#ffffff")
      .setAlign("left");
    this.descText.x = 200;
    this.descText.y = 110;
    this.add(this.descText);

    this.block = new VexSprite()
      .makeGraphic("#ffffff")
      .setPosition(255, 180)
      .setSize(120, 120);
    this.add(this.block);

    this.scoreText = new VexText(100, 100, "Score: 0")
      .setFont("20px Courier New")
      .setBold(true)
      .setColor("#ffffff")
      .setAlign("left");
    this.scoreText.x = 250;
    this.scoreText.y = 350;
    this.add(this.scoreText);

    this.score = 0;

    this.particles = new VexEmitter(0, 0);
    this.add(this.particles);
  }

  update(dt) {
    super.update(dt);

    // TODO: make clickable sprites generic, not hardcoded.
    const mouseX = VexGlobal.mouse.x;
    const mouseY = VexGlobal.mouse.y;
    const clickedBlock =
      mouseX >= this.block.x &&
      mouseX <= this.block.x + this.block.width &&
      mouseY >= this.block.y &&
      mouseY <= this.block.y + this.block.height;

    if (VexGlobal.mouse.justPressed && clickedBlock) {
      this.particles.x = VexGlobal.mouse.x;
      this.particles.y = VexGlobal.mouse.y;
      for (let i = 0; i < 8; i++) {
        this.particles.emit();
        this.particles.fadeParticle(0, 2, () => console.log("fade complete"));
      }

      this.score += 20;
      this.scoreText.setText(`Score: ${this.score}`);
    }
  }
}
