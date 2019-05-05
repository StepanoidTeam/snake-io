import { Sprite } from "./sprite.js";
import { IMAGES } from "../images/index.js";

export class Apple extends Sprite {
  constructor({ x, y }) {
    super({ x, y, image: IMAGES.APPLE_RED });
  }
}
