import { getImage } from "../helpers/get-image.js";
import { recolorImage } from "../helpers/recolor-image.js";
import { getMainColor } from "../helpers/get-main-color.js";

export const IMAGES = {
  DEBUG: "debug.png",
  //bonuses
  APPLE_RED: "red-apple_1f34e.png",
  APPLE_GREEN: "green-apple_1f34f.png",
  WATERMELON: "watermelon_1f349.png",
  BANANA: "banana_1f34c.png",
  EGGPLANT: "aubergine_1f346.png",

  //snake parts
  SNAKE_JOINT: "new-moon-symbol_1f311.png",
  SNAKE_BODY: "full-moon-symbol_1f315.png",
  // SNAKE_HEAD: "pig-face_1f437.png",
  //SNAKE_HEAD: "smiling-face-with-horns_1f608.png",
  SNAKE_HEAD: "frog-face_1f438.png",
  SNAKE_HEAD_FROG: "frog-face_1f438.png",
  SNAKE_HEAD_DEMON: "smiling-face-with-horns_1f608.png",
  SNAKE_HEAD_PIG: "pig-face_1f437.png"
};

export const IMAGE_LIB = (async () => {
  const _imageLib = new Map();
  await Promise.all(
    Object.entries(IMAGES).map(async ([key, value]) => {
      _imageLib.set(value, await getImage(value));
    })
  );

  //custom shit
  const recolorOpacity = (200).toString(16).padStart(2, "0");

  //todo: what if i want to add some after init?
  //ie for snake body recoloring depending on player selection, etc?
  _imageLib.set(
    IMAGES.SNAKE_BODY,
    recolorImage(
      _imageLib.get(IMAGES.SNAKE_BODY),
      getMainColor(_imageLib.get(IMAGES.SNAKE_HEAD)) + recolorOpacity
    )
  );

  _imageLib.set(
    IMAGES.SNAKE_JOINT,
    recolorImage(
      _imageLib.get(IMAGES.SNAKE_JOINT),
      getMainColor(_imageLib.get(IMAGES.SNAKE_HEAD)) + recolorOpacity
    )
  );

  return _imageLib;
})();
