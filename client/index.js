import {} from "./ws-client.js";
import { setupControls } from "./controls/index.js";
import { getScore, sendScore } from "./hi-scores.js";
import { Cell, Apple, SnakePart, Point } from "./components/index.js";
import { initBoard } from "./game-board.js";

const fieldSizeCells = 20; // чем больше число тем больше матрица, то есть размер поля для змеи
const speedMs = 120; // чем больше число тем медленее скорость змеи
// тут наверное вызывается функция и ей передаются параметры. Пыталась добавить еще параметр,но игнорит

const scoreMessageBlock = document.querySelector(".high-scores");
const splashScreen = document.querySelector(".splash-screen");
const gameOver = document.querySelector(".game-over");
const btnStartGame = document.querySelector(".btn-start-game");
const debug = document.querySelector(".debug");

function updateScoreMessage(scores) {
  const listItems = scores.map(s => `<li>${s.name} - ${s.score}</li>`).join("");

  scoreMessageBlock.innerHTML = listItems;
}

function startGameSplash(doneFn, result) {
  splashScreen.classList.remove("hidden");
  btnStartGame.addEventListener("click", startGame);
  document.body.addEventListener(
    "keydown",
    ev => ev.code === "Space" && startGame()
  );

  function startGame() {
    splashScreen.classList.add("hidden");
    btnStartGame.removeEventListener("click", startGame);
    document.body.removeEventListener("keydown", startGame);

    doneFn();
  }
}

const snakeParts = [];
const apples = new Set();

function initNewGame(doneFn, getInput) {
  //Змея движется в пределах 600x на 600y
  const snakeHead = new Point({ x: 5, y: 5 });

  snakeParts.splice(0);
  apples.clear();
  snakeParts.push(new SnakePart(snakeHead));

  // пошел страшный код
  function moveSnakeTo({ x, y }, expand) {
    const snakePart = new SnakePart({ x, y });

    snakeParts.push(snakePart);

    if (!expand) snakeParts.shift(); //Oh my God
  }

  function putNewApple() {
    let x = Math.floor(Math.random() * fieldSizeCells);
    let y = Math.floor(Math.random() * fieldSizeCells);

    apples.add(new Apple({ x, y }));
  }

  putNewApple();

  let timing = setInterval(function() {
    controllingSnake();
  }, speedMs);

  function controllingSnake() {
    let input = getInput();
    const nextPos = Point.add(snakeHead, input);

    if (snakeParts.length === 0) {
      clearInterval(timing);
      doneFn(snakeParts.length);
      return;
    }

    //smashed the wall
    if (
      nextPos.y < 0 ||
      nextPos.y > fieldSizeCells - 1 ||
      nextPos.x < 0 ||
      nextPos.x > fieldSizeCells - 1
    ) {
      snakeParts.shift();
      return;
    }

    //eats itself
    [...snakeParts].forEach((snakePart, partIndex) => {
      if (snakePart.collidesWith(nextPos)) {
        const deadTail = snakeParts.splice(0, partIndex);
      }
    });

    let snakeExpands = false;
    //eat apples
    [...apples.values()]
      .filter(apple => snakeHead.collidesWith(apple))
      .forEach(apple => {
        apples.delete(apple);
        snakeExpands = true;
        putNewApple();
        putNewApple(); //spawn apples!
      });

    moveSnakeTo(nextPos, snakeExpands);
    snakeHead.x = nextPos.x;
    snakeHead.y = nextPos.y;
  }

  return { snakeParts, apples };
}

function promisify(fn, ...args) {
  return new Promise(resolve => fn(resolve, ...args));
}

export function getImage(path) {
  let imgElement = document.createElement("img");
  imgElement.src = "images/" + path;
  return imgElement;
}

const IMAGES = {
  DEBUG: getImage("debug.png"),
  APPLE_RED: getImage("red-apple_1f34e.png"),
  SNAKE_BODY: getImage("new-moon-symbol_1f311.png"),
  SNAKE_JOINT: getImage("medium-black-circle_26ab.png"),
  SNAKE_HEAD: getImage("smiling-face-with-horns_1f608.png")
};

function drawLoop(canvas) {
  const ctx = canvas.getContext("2d");

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw

    apples.forEach(apple => {
      ctx.drawImage(
        IMAGES.APPLE_RED,
        apple.x * Cell.sizePx,
        apple.y * Cell.sizePx,
        Cell.sizePx,
        Cell.sizePx
      );
    });

    snakeParts.reduce((prev, cur, curi) => {
      const isHead = curi === snakeParts.length - 1;

      //joint
      if (prev) {
        ctx.drawImage(
          IMAGES.SNAKE_JOINT,
          (cur.x + (prev.x - cur.x) / 2) * Cell.sizePx,
          (cur.y + (prev.y - cur.y) / 2) * Cell.sizePx,
          Cell.sizePx,
          Cell.sizePx
        );
      }
      //bone
      ctx.drawImage(
        isHead ? IMAGES.SNAKE_HEAD : IMAGES.SNAKE_BODY,
        cur.x * Cell.sizePx,
        cur.y * Cell.sizePx,
        Cell.sizePx,
        Cell.sizePx
      );
      return cur;
    }, null);

    requestAnimationFrame(draw);
  })();
}

(async function gameLoop() {
  gameOver.classList.add("hidden");
  getScore().then(updateScoreMessage);

  //init all

  const boardSize = Cell.sizePx * fieldSizeCells;
  const canvas = document.querySelector("canvas#game");
  canvas.width = boardSize;
  canvas.height = boardSize;
  drawLoop(canvas);

  let getInput = setupControls();
  let gameResult = null;
  while (true) {
    //wait for start
    await promisify(startGameSplash, gameResult);
    //play/dead
    gameResult = await promisify(initNewGame, getInput);

    gameOver.classList.remove("hidden");
    await sendScore(gameResult).then(updateScoreMessage);
  }
})();
