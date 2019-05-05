import { Sprite } from "./sprite.js";
import { IMAGES } from "../images/index.js";

const bonuses = [
  IMAGES.APPLE_RED,
  IMAGES.APPLE_GREEN,
  IMAGES.WATERMELON,
  IMAGES.BANANA,
  IMAGES.EGGPLANT
];

export class Apple extends Sprite {
  constructor({ x, y }) {
    const getRandomBonusImg = () =>
      bonuses[Math.floor(Math.random() * bonuses.length)];

    super({ x, y, image: getRandomBonusImg() });
  }
}
