import { getImage } from "../helpers/get-image.js";
import { recolorImage } from "../helpers/recolor-image.js";
import { getMainColor } from "../helpers/get-main-color.js";

const HEADS = {
  //animals
  FROG: "frog-face_1f438.png",
  PIG: "pig-face_1f437.png",
  CAT: "smiling-cat-face-with-open-mouth_1f63a.png",
  DOG: "dog-face_1f436.png",
  PANDA: "panda-face_1f43c.png",
  KOALA: "koala_1f428.png",
  //mystic
  DEMON: "smiling-face-with-horns_1f608.png",
  SKULL: "skull_1f480.png",
  GHOST: "ghost_1f47b.png",
  //MISC
  NIGGA: "new-moon-with-face_1f31a.png",
  WHITE: "full-moon-with-face_1f31d.png",
  POO: "pile-of-poo_1f4a9.png"
};

export const FOOD = {
  APPLE_RED: "red-apple_1f34e.png",
  APPLE_GREEN: "green-apple_1f34f.png",
  WATERMELON: "watermelon_1f349.png",
  BANANA: "banana_1f34c.png",
  EGGPLANT: "aubergine_1f346.png",
  MUSHROOM: "mushroom_1f344.png",
  CARROT: "carrot_1f955.png",
  CHERRY: "cherries_1f352.png",
  COCONUT: "coconut_1f965.png",
  PINEAPPLE: "pineapple_1f34d.png",
  STRAWBERRY: "strawberry_1f353.png"
};

export const IMAGES = {
  DEBUG: "debug.png",

  ...FOOD,
  //snake parts
  SNAKE_JOINT: "new-moon-symbol_1f311.png",
  SNAKE_BODY: "full-moon-symbol_1f315.png",
  //heads
  ...HEADS
};

function arrayToObject(array) {
  return array.reduce((acc, keyValue) => Object.assign(acc, keyValue), {});
}

export function getRandomKey(obj) {
  const keys = Object.keys(obj);
  const index = Math.floor(Math.random() * keys.length);

  return obj[keys[index]];
}

function getSnakeKeys(head) {
  const headKey = `SNAKE_HEAD_${head}`;
  const bodyKey = `SNAKE_BODY_${head}`;
  const jointKey = `SNAKE_JOINT_${head}`;

  return { headKey, bodyKey, jointKey };
}

export const SNAKE_TYPES = arrayToObject(
  Object.keys(HEADS).map(head => {
    const keys = getSnakeKeys(head);
    return {
      [head]: {
        name: head,
        HEAD: IMAGES[head],
        BODY: keys.bodyKey,
        JOINT: keys.jointKey
      }
    };
  })
);

export const IMAGE_LIB = (async () => {
  const _imageLib = new Map();
  await Promise.all(
    Object.entries(IMAGES).map(async ([key, value]) => {
      _imageLib.set(value, await getImage(value));
    })
  );

  //custom shit

  //todo: what if i want to add some after init?
  //ie for snake body recoloring depending on player selection, etc?

  const dynamicImageKeys = Object.keys(HEADS)
    .map(head => {
      const keys = getSnakeKeys(head);

      //add dynamic images to lib
      recolorBasedOnImg(
        _imageLib,
        IMAGES.SNAKE_BODY,
        IMAGES[head],
        keys.bodyKey
      );
      recolorBasedOnImg(
        _imageLib,
        IMAGES.SNAKE_JOINT,
        IMAGES[head],
        keys.jointKey
      );

      return {
        [keys.headKey]: IMAGES[head],
        [keys.bodyKey]: keys.bodyKey,
        [keys.jointKey]: keys.jointKey
      };
    })
    .flat();

  Object.assign(IMAGES, arrayToObject(dynamicImageKeys));

  return _imageLib;
})();

/**
 * recolor [1] image using main color from [2]
 * @param {Map} imageLib image library to use
 * @param {string} imageToRecolor image reference to recolor
 * @param {string} baseImage image to get main color from
 * @param {string} newImageName new image key name for image library
 * @returns new image based on [1], recolored using main color from [2]
 */
function recolorBasedOnImg(imageLib, imageToRecolor, baseImage, newImageName) {
  const recolorOpacity = (200).toString(16).padStart(2, "0");

  imageLib.set(
    newImageName,
    recolorImage(
      imageLib.get(imageToRecolor),
      getMainColor(imageLib.get(baseImage)) + recolorOpacity
    )
  );
}
