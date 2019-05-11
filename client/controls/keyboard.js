import { DIRECTION } from "./direction.js";

let nextMove = DIRECTION.RIGHT;

function checkKey({ code }) {
  switch (code) {
    case "ArrowUp": {
      nextMove = DIRECTION.UP;
      break;
    }
    case "ArrowDown": {
      nextMove = DIRECTION.DOWN;
      break;
    }
    case "ArrowLeft": {
      nextMove = DIRECTION.LEFT;
      break;
    }
    case "ArrowRight": {
      nextMove = DIRECTION.RIGHT;
      break;
    }
  }
}

export function initKeyboard() {
  document.body.addEventListener("keydown", checkKey);

  return () => nextMove;
}
