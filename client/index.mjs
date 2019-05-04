import {} from "./ws-client.mjs";
import { setupControls } from "./controls/index.mjs";
import { getScore, sendScore } from "./hi-scores.mjs";
import { Cell, Apple, SnakePart, Point } from "./components/index.js";

const fieldSizeCells = 30; // чем больше число тем больше матрица, то есть размер поля для змеи
const speedMs = 90; // чем больше число тем медленее скорость змеи
// тут наверное вызывается функция и ей передаются параметры. Пыталась добавить еще параметр,но игнорит
const boardSize = Cell.sizePx * fieldSizeCells;

const scoreMessageBlock = document.querySelector(".high-scores");
const splashScreen = document.querySelector(".splash-screen");

function initBoard() {
  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  ); /*то что это маштабируемая векторная графика уже поняла....хотела сделать градиент змею*/

  svg.setAttributeNS(
    null,
    "width",
    boardSize
  ); /* Тут ответ.Размер змеи умножается на рамер матрицы,поэтому происходит расширение матрицы при 
  увеличении змеи */

  svg.setAttributeNS(null, "height", boardSize); // тоже самое, только увеличивается высота

  document.body.appendChild(svg); // функция вызывает другую функцию

  return svg;
}

//todo: move to game phase
const svg = initBoard();

//Змея движется в пределах 600x на 600y
const snakeHead = new Point(5, 5);

let snakeLength = 2; // длина змеи

let snakeParts = []; // пустой массив

// пошел страшный код
function moveSnakeTo({ x, y }) {
  const snakePart = new SnakePart(x, y);

  snakeParts.push(snakePart);

  svg.appendChild(snakePart.rect);

  if (snakeParts.length > snakeLength) {
    svg.removeChild(snakeParts.shift().rect); //Oh my God
  }
}

const apples = new Set();

function putNewApple() {
  let x = Math.floor(Math.random() * fieldSizeCells);
  let y = Math.floor(Math.random() * fieldSizeCells);

  const apple = new Apple(x, y);

  svg.appendChild(apple.rect);

  apples.add(apple);
}

putNewApple();

let timing = setInterval(function() {
  controllingSnake();
}, speedMs);

function showSplashScreen(name = "user", score = 0) {
  svg.classList.add("dead");
  splashScreen.classList.add("visible");
}

function updateScoreMessage(scores) {
  const listItems = scores.map(s => `<li>${s.name} - ${s.score}</li>`).join("");

  scoreMessageBlock.innerHTML = listItems;
}

let getInput = setupControls();

function controllingSnake() {
  let input = getInput();
  const nextPos = {
    x: snakeHead.x + input.x,
    y: snakeHead.y + input.y
  };

  if (
    nextPos.y < 0 ||
    nextPos.y > fieldSizeCells - 1 ||
    nextPos.x < 0 ||
    nextPos.x > fieldSizeCells - 1
  ) {
    clearInterval(timing);
    sendScore(snakeLength).then(updateScoreMessage);
    showSplashScreen("bob", snakeLength);

    return;
  }

  [...apples.values()]
    .filter(apple => snakeHead.collidesWith(apple))
    .forEach(a => {
      snakeLength++;
      svg.removeChild(a.rect);
      apples.delete(a);
      putNewApple();
      putNewApple(); //spawn apples!
    });

  snakeParts.forEach(function(snakePart) {
    if (snakePart.collidesWith(nextPos)) {
      clearInterval(timing);
      sendScore(snakeLength).then(updateScoreMessage);
      showSplashScreen("bob", snakeLength);

      return;
    }
  });

  moveSnakeTo(nextPos);
  snakeHead.x = nextPos.x;
  snakeHead.y = nextPos.y;
}

function startup() {
  getScore().then(updateScoreMessage);
}

startup();

(function gameLoop() {
  //init all
  //wait for start
  //play/dead
  //repeat
})();
