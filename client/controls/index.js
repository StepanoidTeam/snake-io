import { initKeyboard } from "./keyboard.js";
import { initTouch } from "./touch.js";

const IS_TOUCH_DEVICE = navigator.MaxTouchPoints > 0;

export function setupControls() {
  let initControls = IS_TOUCH_DEVICE ? initTouch : initKeyboard;

  return initControls();
}
