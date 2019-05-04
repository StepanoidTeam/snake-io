const svgns = "http://www.w3.org/2000/svg"; //НО ОБИДНО!!! не могу поменять змею и точку! научи....

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  collidesWith({ x, y }) {
    return this.x === x && this.y === y;
  }
}

export class Cell extends Point {
  static sizePx = 20; //чем больше число тем больше размер змеи, но матрица почему-то тоже увеличивается

  constructor(x, y) {
    super(x, y);
    //svg
    this.rect = document.createElementNS(svgns, "rect");
    this.rect.setAttributeNS(null, "x", x * Cell.sizePx);
    this.rect.setAttributeNS(null, "y", y * Cell.sizePx);
    this.rect.setAttributeNS(null, "height", Cell.sizePx);
    this.rect.setAttributeNS(null, "width", Cell.sizePx);
  }
}

export class SnakePart extends Cell {
  constructor(x, y) {
    super(x, y);
    // svg
    this.rect.classList.add("snake");
  }
}

export class Apple extends Cell {
  constructor(x, y) {
    super(x, y);
    // svg
    this.rect.classList.add("apple");
  }
}
