export class Point {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  collidesWith({ x, y }) {
    return this.x === x && this.y === y;
  }

  static add(...points) {
    const result = points.reduce(
      (acc, point) => ({
        x: acc.x + point.x,
        y: acc.y + point.y
      }),
      { x: 0, y: 0 }
    );

    return new Point(result);
  }

  add(...points) {
    Object.assign(this, Point.add(this, points));
  }
}
