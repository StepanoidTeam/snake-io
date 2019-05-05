export function getMainColor(image) {
  const ctx = document.createElement("canvas").getContext("2d");

  ctx.imageSmoothingEnabled = false; // true;
  ctx.drawImage(image, 0, 0, 1, 1);

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data.slice(0, 3);

  const hexColor = [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("");

  return `#${hexColor}`;
}
