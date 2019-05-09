import {} from "./ws-client.js";
import { setupControls } from "./controls/index.js";
import { getScore, sendScore } from "./hi-scores.js";
import { Apple, Point, Snake } from "./components/index.js";
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

function initNewGame(deadFn, getInput) {
  gameComponentContainer.clear();

  const apples = new Container();
  let applesCollected = 0;

  const snake = new Snake({ x: 5, y: 5 });

  gameComponentContainer.add(apples);
  gameComponentContainer.add(snake);

  function putNewApple() {
    let x = Math.floor(Math.random() * fieldSizeCells);
    let y = Math.floor(Math.random() * fieldSizeCells);

    apples.add(new Apple({ x, y }));
  }

  putNewApple();

  let stopUpdates = false;
  let lastRender = 0;
  (function update(timestamp) {
    if (stopUpdates) return;

    let progress = timestamp - lastRender;

    if (progress > 100) {
      controllingSnake();
      lastRender = timestamp;
    }
    requestAnimationFrame(update);
  })();

  function controllingSnake() {
    let input = getInput();

    if (snake.isDead()) {
      stopUpdates = true;
      //todo: count apples, not snake len
      deadFn(applesCollected);
      return;
    }

    const nextPos = Point.add(snake.head(), input);
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

    //eat apples
    [...apples.values()]
      .filter(apple => snake.head().collidesWith(apple))
      .forEach(apple => {
        apples.delete(apple);
        applesCollected++;
        snake.grow(nextPos);

        //spawn apples!
        putNewApple();
        putNewApple();
      });

    snake.moveTo(nextPos);
  }
}

function promisify(fn, ...args) {
  return new Promise(resolve => fn(resolve, ...args));
}

async function drawLoop(canvas) {
  const ctx = canvas.getContext("2d");

  (function draw() {
    // from korablike
    // function go(ts) {
    //   requestAnimationFrame(go)
    //   cham.update()
    //   if (!ts) {
    //     return
    //   }
    //   if (prevTs === false) {
    //     prevTs = ts;
    //     return;
    //   }
    //   var time = ts - prevTs
    //   prevTs = ts
    //   drawBullets(time)

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameComponentContainer.forEach(gc => gc.draw(ctx));

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
