import { initKeyboard } from "./keyboard.js";
import { initTouch } from "./touch.js";

const IS_TOUCH_DEVICE = "ontouchstart" in window;

export function setupControls() {
  let initControls = IS_TOUCH_DEVICE ? initTouch : initKeyboard;

  if (IS_TOUCH_DEVICE) document.body.classList.add("is-touch");

  return initControls();
}
