let tStartX;
let tStartY;
let nextMoveX = 1; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится
let nextMoveY = 0; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится

function handleStart(event) {
  event.preventDefault();
  tStartX = event.touches[0].screenX;
  tStartY = event.touches[0].screenY;
}
function handleEnd(event) {
  event.preventDefault();
  let tEndX = event.changedTouches[0].screenX;
  let tEndY = event.changedTouches[0].screenY;

  let totalX = tStartX - tEndX;
  let totalY = tStartY - tEndY;

  let move;
  if (Math.abs(totalX) > Math.abs(totalY)) {
    totalX >= 0 ? (move = 4) : (move = 2);
  } else {
    totalY >= 0 ? (move = 1) : (move = 3);
  }

  if (move == 1) {
    //slide up
    nextMoveX = 0;
    nextMoveY = -1;
  } else if (move == 3) {
    //slide down
    nextMoveX = 0;
    nextMoveY = 1;
  } else if (move == 4) {
    //slide left
    nextMoveX = -1;
    nextMoveY = 0;
  } else if (move == 2) {
    //slide right
    nextMoveX = 1;
    nextMoveY = 0;
  }
}

export function initTouch() {
  document.body.addEventListener("touchstart", handleStart, false);
  document.body.addEventListener("touchend", handleEnd, false);

  return () => ({ x: nextMoveX, y: nextMoveY });
}
