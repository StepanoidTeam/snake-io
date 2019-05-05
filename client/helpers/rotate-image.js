export function rotateImage(image, degrees) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;
  //todo: not working
  //seems something with x,y
  const x = image.width / 2;
  const y = image.height / 2;
  const angle = (degrees * Math.PI) / 180;

  ctx.translate(x + image.width / 2, y + image.height / 2);
  ctx.rotate(angle);
  ctx.translate(-x - image.width / 2, -y - image.height / 2);
  ctx.drawImage(image, x, y, image.width, image.height);
  ctx.translate(x + image.width / 2, y + image.height / 2);
  ctx.rotate(-angle);
  ctx.translate(-x - image.width / 2, -y - image.height / 2);

  //from pacman
  // const { scale = 1, rotate = 0, position, size } = this.props;

  //   ctx.setTransform(
  //     scale,
  //     0,
  //     0,
  //     scale,
  //     position[0] + size[0] / 2,
  //     position[1] + size[1] / 2
  //   );
  //   ctx.rotate(getRadians(rotate));
  //   ctx.drawImage(this.img, -size[0] / 2, -size[1] / 2, size[0], size[1]);
}
