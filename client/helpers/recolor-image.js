export function recolorImage(image, color) {
  const tempContext = document.createElement("canvas").getContext("2d");
  tempContext.canvas.width = image.width;
  tempContext.canvas.height = image.height;

  //tempContext.globalCompositeOperation = "source-over";
  tempContext.clearRect(
    0,
    0,
    tempContext.canvas.width,
    tempContext.canvas.height
  );
  tempContext.drawImage(image, 0, 0, image.width, image.height);
  tempContext.globalCompositeOperation = "source-atop";
  tempContext.fillStyle = color;
  tempContext.fillRect(0, 0, image.width, image.height);

  return tempContext.canvas;
}
