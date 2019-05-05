/**
 * loads image from /images/ dir
 * @param {string} name image name in /images/ folder
 * @returns {Promise<HTMLImageElement>} promise with loaded image
 */
export function getImage(name) {
  return new Promise(resolve => {
    const imgElement = document.createElement("img");
    imgElement.src = "images/" + name;

    imgElement.addEventListener("load", () => resolve(imgElement), {
      once: true
    });
  });
}

getImage();
