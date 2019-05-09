import { Point, Sprite } from "./index.js";
import { Container } from "./container.js";
import { IMAGES } from "../images/index.js";

export class Snake extends Container {
  constructor({ x, y }) {
    super();
    this.snakeParts = [new Point({ x, y })];
    this.sprites = {
      //todo: make body/joint recoloring here?
      snakeHead: new Sprite({ x, y, image: IMAGES.SNAKE_HEAD_DEMON }),
      snakeBody: new Sprite({ x, y, image: IMAGES.SNAKE_BODY }),
      snakeJoint: new Sprite({ x, y, image: IMAGES.SNAKE_JOINT })
    };
  }

  head() {
    const [head] = this.snakeParts.slice(-1);
    return head;
  }

  tail() {
    const [tail] = this.snakeParts.slice(0, 1);
    return tail;
  }

  grow() {
    this.snakeParts.unshift(new Point(this.tail()));
  }

  shrink() {
    this.snakeParts.shift();
  }

  split(point) {
    const splitIndex = this.snakeParts.findIndex(sp => sp.collidesWith(point));

    const tail = this.snakeParts.splice(0, splitIndex);
    console.log("snake split", tail, splitIndex);
  }

  moveTo({ x, y }) {
    this.snakeParts.push(new Point({ x, y }));
    this.shrink();
  }

  isDead() {
    return this.snakeParts.length === 0;
  }

  draw(ctx) {
    if (this.isDead()) return;
    //draw joints
    if (this.snakeParts.length > 1) {
      this.snakeParts.reduce((prev, part) => {
        this.sprites.snakeJoint.x = part.x + (prev.x - part.x) / 2;
        this.sprites.snakeJoint.y = part.y + (prev.y - part.y) / 2;
        this.sprites.snakeJoint.draw(ctx);

        return part;
      });
    }

    //draw body
    this.snakeParts.forEach(part => {
      this.sprites.snakeBody.x = part.x;
      this.sprites.snakeBody.y = part.y;
      this.sprites.snakeBody.draw(ctx);
    });

    //draw head

    this.sprites.snakeHead.move(this.head());
    this.sprites.snakeHead.draw(ctx);
  }
}
