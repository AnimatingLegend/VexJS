import VexBasic from "../../VexBasic.js";
import VexGlobal from "../../VexGlobal.js";

/**
 * @file VexTilemap.js
 *
 * Loads CSV tile data and draws only the visible portion of a map to keep
 *  rendering costs low for large levels.
 */
export default class VexTilemap extends VexBasic {
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;

    this.tileWidth = 0;
    this.tileHeight = 0;
    this.widthInTiles = 0;
    this.heightInTiles = 0;

    this.width = 0;
    this.height = 0;

    this.data = [];

    this.tileSet = null;
    this.scrollFactor = { x: 1, y: 1 };
  }

  draw(ctx, camera) {
    if (!this.visible || !this.tileSet) return;

    // Skip off-screen columns so large maps do not require full-map drawing.
    const startCol = Math.max(
      0,
      Math.floor((camera.scroll.x - this.x) / this.tileWidth),
    );

    // Clamp visible columns to the map boundary to avoid out-of-range tile reads.
    const endCol = Math.min(
      this.widthInTiles,
      Math.ceil(
        (camera.scroll.x + camera.width / camera.zoom - this.x) /
          this.tileWidth,
      ),
    );

    // Skip off-screen rows so large maps do not require full-map drawing.
    const startRow = Math.max(
      0,
      Math.floor((camera.scroll.y - this.y) / this.tileHeight),
    );

    // Clamp visible rows to the map boundary to avoid out-of-range tile reads.
    const endRow = Math.min(
      this.heightInTiles,
      Math.ceil(
        (camera.scroll.y + camera.height / camera.zoom - this.y) /
          this.tileHeight,
      ),
    );

    // The atlas width sets how many tile graphics fit in each source row.
    const tilesetCols = Math.floor(this.tileSet.width / this.tileWidth);

    // Restrict iteration to the visible region to keep rendering proportional to the viewport.
    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const tileIndex = this.getTileIndex(c, r);
        // Empty cells have no tile graphic to draw.
        if (tileIndex <= 0) continue;

        const graphicIndex = tileIndex - 1;
        const sx = (graphicIndex % tilesetCols) * this.tileWidth;
        const sy = Math.floor(graphicIndex / tilesetCols) * this.tileHeight;

        const dx = this.x + c * this.tileWidth;
        const dy = this.y + r * this.tileHeight;

        ctx.drawImage(
          this.tileSet,
          sx,
          sy,
          this.tileWidth,
          this.tileHeight,
          dx,
          dy,
          this.tileWidth,
          this.tileHeight,
        );
      }
    }
  }

  // Use a consistent sentinel so callers can detect coordinates outside the map.
  getTileIndex(col, row) {
    if (
      col < 0 ||
      col >= this.widthInTiles ||
      row < 0 ||
      row >= this.heightInTiles
    )
      return -1;

    let index = row * this.widthInTiles + col;
    return this.data[index];
  }

  // Convert world positions to map cells for gameplay queries.
  getTileAt(worldX, worldY) {
    const col = Math.floor((worldX - this.x) / this.tileWidth);
    const row = Math.floor((worldY - this.y) / this.tileHeight);
    return this.getTileIndex(col, row);
  }

  // Load the image and map data together so the tilemap is ready to draw on return.
  async loadMapFromCSV(csvData, tilesetPath, tileWidth, tileHeight) {
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileSet = await VexGlobal.loadImage(tilesetPath);

    const rows = csvData.trim().split("\n");
    this.heightInTiles = rows.length;
    this.data = [];

    // Store rows in order so tile coordinates map directly to flat array indices.
    for (let r = 0; r < rows.length; r++) {
      const cols = rows[r]
        .split(",")
        .map((value) => parseInt(value.trim(), 10));
      if (r === 0) this.widthInTiles = cols.length;
      this.data.push(...cols);
    }

    this.width = this.widthInTiles * this.tileWidth;
    this.height = this.heightInTiles * this.tileHeight;
    return this;
  }
}
