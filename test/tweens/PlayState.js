import {
  VexGlobal,
  VexState,
  VexSprite,
  VexText,
  VexTween,
} from "../../index.js";

export default class PlayState extends VexState {
  create() {
    // Column 1: sineIn (center: 80)
    var sineInLabel = new VexText(80, 20, "sineIn")
      .setFont("16px sans-serif")
      .setAlign("center")
      .setColor("#ffffff");
    this.add(sineInLabel);

    this.boxSineIn = new VexSprite()
      .makeGraphic(40, 40, "#44aaff")
      .setPosition(60, 50);
    this.add(this.boxSineIn);

    // Column 2: sineOut (center: 240)
    var sineOutLabel = new VexText(240, 20, "sineOut")
      .setFont("16px sans-serif")
      .setAlign("center")
      .setColor("#ffffff");
    this.add(sineOutLabel);

    this.boxSineOut = new VexSprite()
      .makeGraphic(40, 40, "#44ff88")
      .setPosition(220, 50);
    this.add(this.boxSineOut);

    // Column 3: sineInOut (center: 400)
    var sineInOutLabel = new VexText(400, 20, "sineInOut")
      .setFont("16px sans-serif")
      .setAlign("center")
      .setColor("#ffffff");
    this.add(sineInOutLabel);

    this.boxSineInOut = new VexSprite()
      .makeGraphic(40, 40, "#ffaa00")
      .setPosition(380, 50);
    this.add(this.boxSineInOut);

    // Column 4: bounceOut (center: 560)
    var bounceOutLabel = new VexText(560, 20, "bounceOut")
      .setFont("16px sans-serif")
      .setAlign("center")
      .setColor("#ffffff");
    this.add(bounceOutLabel);

    this.boxBounceOut = new VexSprite()
      .makeGraphic(40, 40, "#ff4444")
      .setPosition(540, 50);
    this.add(this.boxBounceOut);

    var descText = new VexText(320, 440, "Click anywhere to reset the tweens.")
      .setFont("18px sans-serif")
      .setAlign("center")
      .setColor("#ffffff");
    this.add(descText);

    this._startTween();
  }

  _startTween() {
    this.boxSineIn.y = 50;
    VexTween.tween(this.boxSineIn, { y: 380 }, 2, {
      ease: VexTween.Easing.sineIn,
      onComplete: () => console.log("SineIn Tween Complete"),
    });

    this.boxSineOut.y = 50;
    VexTween.tween(this.boxSineOut, { y: 380 }, 2, {
      ease: VexTween.Easing.sineOut,
      onComplete: () => console.log("SineOut Tween Complete"),
    });

    this.boxSineInOut.y = 50;
    VexTween.tween(this.boxSineInOut, { y: 380 }, 2, {
      ease: VexTween.Easing.sineInOut,
    });

    this.boxBounceOut.y = 50;
    VexTween.tween(this.boxBounceOut, { y: 380 }, 2, {
      ease: VexTween.Easing.bounceOut,
      onComplete: () => console.log("BounceOut Tween Complete"),
    });
  }

  update(dt) {
    super.update(dt);
    // Reset positions to y = 50 and restart the tweens.
    if (VexGlobal.mouse.justPressed) {
      this.boxSineIn.y = 50;
      this.boxSineOut.y = 50;
      this.boxSineInOut.y = 50;
      this.boxBounceOut.y = 50;
      this._startTween();
    }
  }
}
