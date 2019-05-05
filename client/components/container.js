export class Container extends Set {
  draw(ctx) {
    [...this].forEach(item => item.draw(ctx));
  }
}
