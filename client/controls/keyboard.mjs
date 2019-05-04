let nextMoveX = 1; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится
let nextMoveY = 0; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == "38") {
    //up arrow
    nextMoveX = 0;
    nextMoveY = -1;
  } else if (e.keyCode == "40") {
    //down arrow
    nextMoveX = 0;
    nextMoveY = 1;
  } else if (e.keyCode == "37") {
    //left arrow
    nextMoveX = -1;
    nextMoveY = 0;
  } else if (e.keyCode == "39") {
    //right arrow
    nextMoveX = 1;
    nextMoveY = 0;
  }
}

export function initKeyboard() {
  document.body.addEventListener("keydown", checkKey, false);

  return () => ({ x: nextMoveX, y: nextMoveY });
}
