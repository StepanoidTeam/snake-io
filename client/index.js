import {} from "./ws-client.js";
import { setupControls } from "./controls/index.js";
import { getScore, sendScore } from "./hi-scores.js";
import { Sprite, Apple, Point, Snake } from "./components/index.js";
import { recolorImage } from "./helpers/recolor-image.js";
import { getImage } from "./helpers/get-image.js";
import { getMainColor } from "./helpers/get-main-color.js";
import { IMAGES } from "./images/index.js";
import { Container } from "./components/container.js";
import { cellSizePx } from "./components/sprite.js";

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
//todo: encapsulate in game phase

const gameComponentContainer = new Set();

function initNewGame(doneFn, getInput) {
  gameComponentContainer.clear();

  const apples = new Container();

  const snakeHead = new Point({ x: 5, y: 5 });
  const snake = new Snake(snakeHead);

  gameComponentContainer.add(apples);
  gameComponentContainer.add(snake);

  // пошел страшный код
  //todo: move to snake
  function moveSnakeTo({ x, y }, expand) {
    snake.snakeParts.push(new Point({ x, y }));

    if (!expand) snake.snakeParts.shift(); //Oh my God
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

    if (snake.snakeParts.length === 0) {
      clearInterval(timing);
      //todo: count apples, not snake len
      doneFn(snake.snakeParts.length);
      return;
    }

    //smashed the wall
    if (
      nextPos.y < 0 ||
      nextPos.y > fieldSizeCells - 1 ||
      nextPos.x < 0 ||
      nextPos.x > fieldSizeCells - 1
    ) {
      snake.snakeParts.shift();
      return;
    }

    //eats itself
    [...snake.snakeParts].forEach((snakePart, partIndex) => {
      if (snakePart.collidesWith(nextPos)) {
        const deadTail = snake.snakeParts.splice(0, partIndex);
        //todo: animate deadtail?
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
}

function promisify(fn, ...args) {
  return new Promise(resolve => fn(resolve, ...args));
}

async function drawLoop(canvas) {
  const ctx = canvas.getContext("2d");

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw

    gameComponentContainer.forEach(gc => gc.draw(ctx));

    function drawRotated(image, x, y, size, degrees) {
      const radius = size / 2;
      ctx.translate(x + radius, y + radius);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.translate(-x - radius, -y - radius);
      ctx.drawImage(image, x, y, size, size);
      ctx.translate(x + radius, y + radius);
      ctx.rotate((-degrees * Math.PI) / 180);
      ctx.translate(-x - radius, -y - radius);
    }

    requestAnimationFrame(draw);
  })();
}

(async function gameLoop() {
  gameOver.classList.add("hidden");
  getScore().then(updateScoreMessage);

  //init all

  const boardSize = cellSizePx * fieldSizeCells;
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
