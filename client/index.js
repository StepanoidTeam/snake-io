import {} from "./ws-client.js";
import { setupControls } from "./controls/index.js";
import { getScore, sendScore } from "./hi-scores.js";
import { Cell, Apple, SnakePart, Point } from "./components/index.js";
import { initBoard } from "./game-board.js";

const fieldSizeCells = 30; // чем больше число тем больше матрица, то есть размер поля для змеи
const speedMs = 90; // чем больше число тем медленее скорость змеи
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

function initNewGame(doneFn, svg, getInput) {
  svg.innerHTML = "";
  //Змея движется в пределах 600x на 600y
  const snakeHead = new Point({ x: 5, y: 5 });

  const snakeParts = [new SnakePart(snakeHead)]; // пустой массив

  // пошел страшный код
  function moveSnakeTo({ x, y }, expand) {
    const snakePart = new SnakePart({ x, y });

    snakeParts.push(snakePart);

    svg.appendChild(snakePart.rect);

    if (!expand) svg.removeChild(snakeParts.shift().rect); //Oh my God
  }

  const apples = new Set();

  function putNewApple() {
    let x = Math.floor(Math.random() * fieldSizeCells);
    let y = Math.floor(Math.random() * fieldSizeCells);

    const apple = new Apple({ x, y });

    svg.appendChild(apple.rect);

    apples.add(apple);
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
      svg.removeChild(snakeParts.shift().rect);
      return;
    }

    //eats itself
    [...snakeParts].forEach((snakePart, partIndex) => {
      if (snakePart.collidesWith(nextPos)) {
        const deadTail = snakeParts.splice(0, partIndex);

        deadTail.forEach(part => svg.removeChild(part.rect)); //Oh my God
      }
    });

    let snakeExpands = false;
    //eat apples
    [...apples.values()]
      .filter(apple => snakeHead.collidesWith(apple))
      .forEach(apple => {
        svg.removeChild(apple.rect);
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

(async function gameLoop() {
  gameOver.classList.add("hidden");
  getScore().then(updateScoreMessage);

  //init all
  const svg = initBoard();
  let getInput = setupControls();
  let gameResult = null;
  while (true) {
    //wait for start
    await promisify(startGameSplash, gameResult);
    //play/dead
    gameResult = await promisify(initNewGame, svg, getInput);

    gameOver.classList.remove("hidden");
    await sendScore(gameResult).then(updateScoreMessage);
  }
})();
