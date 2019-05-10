import { Sprite } from "./sprite.js";
import { FOOD, getRandomKey } from "../images/index.js";

export class Bonus extends Sprite {
  constructor({ x, y }) {
    super({ x, y, image: getRandomKey(FOOD) });
  }
}
