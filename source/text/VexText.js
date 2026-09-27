import VexBasic from "../VexBasic.js";

/**
 * @file VexText.js
 *
 * Renders text with the canvas API and follows sprite positioning rules so
 *  text can share the same camera and group behavior as other game objects.
 */
export default class VexText extends VexBasic {
  constructor(x = 0, y = 0, text = "", options = {}) {
    super();
    this.x = x;
    this.y = y;
    this.text = text;

    this.font = options.font || "16px sans-serif";
    this.bold = options.bold || false;
    this.color = options.color || "#ffffff";
    this.align = options.align || "left";
    this.alpha = options.alpha ?? 1;

    // Screen-space text is the default so HUD labels stay fixed as the camera moves.
    this.scrollFactor = {
      x: options.scrollFactor?.x ?? 0,
      y: options.scrollFactor?.y ?? 0,
    };
    this.offset = {
      x: 0,
      y: 0,
    };
  }

  setText(text) {
    this.text = text;
    return this;
  }

  draw(ctx, camera) {
    if (!this.visible) return;

    // Compensate for the canvas transform so screen-space text stays fixed as the camera moves.
    const sx =
      this.x + camera.scroll.x * (1 - this.scrollFactor.x) - this.offset.x;
    const sy =
      this.y + camera.scroll.y * (1 - this.scrollFactor.y) - this.offset.y;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = this.bold ? `bold ${this.font}` : this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = "top";
    ctx.fillText(this.text, sx, sy);
    ctx.restore();
  }
}
