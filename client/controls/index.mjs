import { initKeyboard } from "./keyboard.mjs";
import { initTouch } from "./touch.mjs";

const IS_TOUCH_DEVICE = navigator.MaxTouchPoints > 0;

export function setupControls() {
  let initControls = IS_TOUCH_DEVICE ? initTouch : initKeyboard;

  return initControls();

  while (true) {
    // yield getInput();
  }
}
