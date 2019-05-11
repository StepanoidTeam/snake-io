import { DIRECTION } from "./direction.js";

let tStartX;
let tStartY;
let nextMove = DIRECTION.RIGHT;

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
    totalX >= 0 ? (nextMove = DIRECTION.LEFT) : (nextMove = DIRECTION.RIGHT);
  } else {
    totalY >= 0 ? (nextMove = DIRECTION.UP) : (nextMove = DIRECTION.DOWN);
  }
}

export function initTouch() {
  //todo: use touchmove instead?
  document.body.addEventListener("touchstart", handleStart);
  document.body.addEventListener("touchend", handleEnd);

  return () => nextMove;
}
