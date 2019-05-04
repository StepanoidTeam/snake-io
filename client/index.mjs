import {} from "./ws-client.mjs";
import { setupControls } from "./controls/index.mjs";
import { getScore, sendScore } from "./hi-scores.mjs";

let svg = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
); /*то что это маштабируемая векторная графика уже поняла....хотела сделать градиент змею*/
let svgns = "http://www.w3.org/2000/svg"; //НО ОБИДНО!!! не могу поменять змею и точку! научи....
let cellSizePx = 20; //чем больше число тем больше размер змеи, но матрица почему-то тоже увеличивается
let fieldSizeCells = 30; // чем больше число тем больше матрица, то есть размер поля для змеи
let speedMs = 90; // чем больше число тем медленее скорость змеи
let scoreMessageBlock = document.querySelector(".high-scores");
const gameOverScreen = document.querySelector(".game-over");

gameOverScreen.setAttribute("hidden", true);

// тут наверное вызывается функция и ей передаются параметры. Пыталась добавить еще параметр,но игнорит
svg.setAttributeNS(
  null,
  "width",
  cellSizePx * fieldSizeCells
); /* Тут ответ.Размер змеи умножается на рамер матрицы,поэтому происходит расширение матрицы при 
увеличении змеи */
svg.id = "game";
svg.setAttributeNS(null, "height", cellSizePx * fieldSizeCells); // тоже самое, только увеличивается высота

document.body.appendChild(svg); // функция вызывает другую функцию

//Змея движется в пределах 600x на 600y
const snakeHead = {
  x: 6,
  y: 5
};
let snakeLength = 2; // длина змеи

let snakeParts = []; // пустой массив

// пошел страшный код
function drawPoint(x, y) {
  const snakePart = new SnakePart(x, y);

  snakeParts.push(snakePart);

  svg.appendChild(snakePart.rect);

  if (snakeParts.length > snakeLength) {
    svg.removeChild(snakeParts.shift().rect); //Oh my God
  }
}

const apples = new Set();

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    //svg
    this.rect = document.createElementNS(svgns, "rect");
    this.rect.setAttributeNS(null, "x", x * cellSizePx);
    this.rect.setAttributeNS(null, "y", y * cellSizePx);
    this.rect.setAttributeNS(null, "height", cellSizePx);
    this.rect.setAttributeNS(null, "width", cellSizePx);
  }

  collidesWith({ x, y }) {
    return this.x === x && this.y === y;
  }
}

class SnakePart extends Cell {
  constructor(x, y) {
    super(x, y);
    // svg
    this.rect.setAttributeNS(null, "fill", "black");
    this.rect.setAttributeNS(null, "class", "snake");
  }
}

class Apple extends Cell {
  constructor(x, y) {
    super(x, y);
    // svg
    this.rect.setAttributeNS(null, "fill", "#f00");
  }

  static gen() {
    let x = Math.floor(Math.random() * fieldSizeCells);
    let y = Math.floor(Math.random() * fieldSizeCells);

    return new Apple(x, y);
  }
}

function putNewAple() {
  const apple = Apple.gen();
  svg.appendChild(apple.rect);

  apples.add(apple);
}

putNewAple();
let timing = setInterval(function() {
  controllingSnake();
}, speedMs);

function gameOverMessage(name = "user", score = "0") {
  let message = "Name: " + name + " Score: " + score;

  gameOverScreen.removeAttribute("hidden");
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
    svg.setAttributeNS(null, "style", "border: 20px outset #696969;");

    clearInterval(timing);
    sendScore(snakeLength).then(updateScoreMessage);
    gameOverMessage("bob", snakeLength);

    return;
  }

  [...apples.values()]
    .filter(apple => apple.collidesWith(snakeHead))
    .forEach(a => {
      snakeLength++;
      svg.removeChild(a.rect);
      apples.delete(a);
      putNewAple();
      putNewAple(); //spawn apples!
    });

  snakeParts.forEach(function(snakePart) {
    if (snakePart.collidesWith(nextPos)) {
      clearInterval(timing);
      sendScore(snakeLength).then(updateScoreMessage);
      gameOverMessage("bob", snakeLength);

      return;
    }
  });

  drawPoint(nextPos.x, nextPos.y);
  snakeHead.x = nextPos.x;
  snakeHead.y = nextPos.y;
}

function startup() {
  getScore().then(updateScoreMessage);

  //todo: init controls
}

startup();
