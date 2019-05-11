const MOVE = {
  LEFT: { x: -1, y: 0 },
  UP: { x: 0, y: -1 },
  RIGHT: { x: +1, y: 0 },
  DOWN: { x: 0, y: +1 }
};

let tStartX;
let tStartY;
let nextMove = MOVE.RIGHT;

function handleStart(event) {
  tStartX = event.touches[0].screenX;
  tStartY = event.touches[0].screenY;
}
function handleEnd(event) {
  let tEndX = event.changedTouches[0].screenX;
  let tEndY = event.changedTouches[0].screenY;

  let totalX = tStartX - tEndX;
  let totalY = tStartY - tEndY;

  if (Math.abs(totalX) > Math.abs(totalY)) {
    totalX >= 0 ? (nextMove = MOVE.LEFT) : (nextMove = MOVE.RIGHT);
  } else {
    totalY >= 0 ? (nextMove = MOVE.UP) : (nextMove = MOVE.DOWN);
  }
}

export function initTouch() {
  //todo: use touchmove instead?
  document.body.addEventListener("touchstart", handleStart);
  document.body.addEventListener("touchend", handleEnd);

  return () => nextMove;
}
