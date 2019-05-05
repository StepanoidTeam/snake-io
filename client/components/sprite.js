import { Point } from "./point.js";
import { IMAGE_LIB } from "../images/index.js";
export const cellSizePx = 144;

export class Sprite extends Point {
  constructor({ x, y, image }) {
    super({ x, y });

    this.init(image);
  }

  async init(image) {
    this.img = (await IMAGE_LIB).get(image);
  }

  draw(ctx) {
    if (!this.img) return;

    ctx.drawImage(
      this.img,

      this.x * cellSizePx,
      this.y * cellSizePx,
      this.img.width,
      this.img.height
    );
  }
}
