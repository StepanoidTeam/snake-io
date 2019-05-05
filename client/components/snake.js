import { Point, Sprite } from "./index.js";
import { Container } from "./container.js";
import { cellSizePx } from "./sprite.js";
import { IMAGES } from "../images/index.js";

export class Snake extends Container {
  snakeParts = [];
  constructor({ x, y }) {
    super();
    this.snakeParts = [new Point({ x, y })];
    this.sprites = {
      //todo: make body/joint recoloring here?
      snakeHead: new Sprite({ x, y, image: IMAGES.SNAKE_HEAD }),
      snakeBody: new Sprite({ x, y, image: IMAGES.SNAKE_BODY }),
      snakeJoint: new Sprite({ x, y, image: IMAGES.SNAKE_JOINT })
    };
  }

  draw(ctx) {
    this.snakeParts.reduce((prev, cur, curIndex) => {
      const isHead = curIndex === this.snakeParts.length - 1;

      //joint
      if (prev) {
        this.sprites.snakeJoint.x = cur.x + (prev.x - cur.x) / 2;
        this.sprites.snakeJoint.y = cur.y + (prev.y - cur.y) / 2;
        this.sprites.snakeJoint.draw(ctx);
      }

      if (prev && isHead) {
        let degrees = 0;
        if (prev.y - cur.y === -1) {
          degrees = 180;
        } else if (prev.y - cur.y === 1) {
          degrees = 0;
        } else if (prev.x - cur.x === -1) {
          degrees = 90;
        } else if (prev.x - cur.x === 1) {
          degrees = 270;
        }

        // drawRotated(
        //   IMAGES.SNAKE_HEAD,
        //   cur.x * cellSizePx,
        //   cur.y * cellSizePx,
        //   cellSizePx,
        //   degrees
        // );

        this.sprites.snakeHead.x = cur.x;
        this.sprites.snakeHead.y = cur.y;
        this.sprites.snakeHead.draw(ctx);
      }
      //bone
      else {
        this.sprites.snakeBody.x = cur.x;
        this.sprites.snakeBody.y = cur.y;
        this.sprites.snakeBody.draw(ctx);
      }

      return cur;
    }, null);
  }
}
