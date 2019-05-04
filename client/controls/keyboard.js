let nextMoveX = 1; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится
let nextMoveY = 0; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится

function checkKey({ code }) {
  switch (code) {
    case "ArrowUp": {
      nextMoveX = 0;
      nextMoveY = -1;
      break;
    }
    case "ArrowDown": {
      nextMoveX = 0;
      nextMoveY = 1;
      break;
    }
    case "ArrowLeft": {
      nextMoveX = -1;
      nextMoveY = 0;
      break;
    }
    case "ArrowRight": {
      nextMoveX = 1;
      nextMoveY = 0;
      break;
    }
  }
}

export function initKeyboard() {
  document.body.addEventListener("keydown", checkKey);

  return () => ({ x: nextMoveX, y: nextMoveY });
}
