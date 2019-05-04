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
let currentX = 6; // изначальное положение змеи по x (горизонтально)
let currentY = 5; // изначальное положение змеи по y (вертикально)
let snakeLength = 2; // длина змеи

let snakeParts = []; // пустой массив

// пошел страшный код
function drawPoint(x, y) {
  let rect = [document.createElementNS(svgns, "rect"), x, y];
  let rectObj = rect[0];
  rectObj.setAttributeNS(null, "x", x * cellSizePx); //вроде как вызов функции с заданными параметрами
  rectObj.setAttributeNS(null, "y", y * cellSizePx); // не пойму зачем null.
  rectObj.setAttributeNS(null, "height", cellSizePx); // у нас в тесте вроде было похожее.
  rectObj.setAttributeNS(null, "width", cellSizePx); // Снчала стоял 0,но не прокатило.Поменяли на null
  rectObj.setAttributeNS(null, "fill", "#000"); // Но не поняла почему
  rectObj.setAttributeNS(null, "class", "snake");
  snakeParts.push(rect);
  svg.appendChild(rectObj);
  if (snakeParts.length > snakeLength) {
    svg.removeChild(snakeParts[0][0]); //Oh my God
    snakeParts.shift();
  }
}

const apples = new Set();

class Apple {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // svg part
    const rect = document.createElementNS(svgns, "rect");
    rect.setAttributeNS(null, "x", x * cellSizePx);
    rect.setAttributeNS(null, "y", y * cellSizePx);
    rect.setAttributeNS(null, "height", cellSizePx);
    rect.setAttributeNS(null, "width", cellSizePx);
    rect.setAttributeNS(null, "fill", "#f00");

    this.rect = rect;
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
  let nextX = currentX + input.x;
  let nextY = currentY + input.y;

  if (
    nextY < 0 ||
    nextY > fieldSizeCells - 1 ||
    nextX < 0 ||
    nextX > fieldSizeCells - 1
  ) {
    svg.setAttributeNS(null, "style", "border: 20px outset #696969;");

    clearInterval(timing);
    sendScore(snakeLength).then(updateScoreMessage);
    gameOverMessage("bob", snakeLength);

    return;
  }

  [...apples.values()]
    .filter(a => a.x === currentX && a.y === currentY)
    .forEach(a => {
      snakeLength++;
      svg.removeChild(a.rect);
      apples.delete(a);
      putNewAple();
      putNewAple(); //spawn apples!
    });

  snakeParts.forEach(function(element) {
    if (nextX == element[1] && nextY == element[2]) {
      clearInterval(timing);
      sendScore(snakeLength).then(updateScoreMessage);
      gameOverMessage("bob", snakeLength);

      return;
    }
  });

  drawPoint(nextX, nextY);
  currentX = nextX;
  currentY = nextY;
}

function startup() {
  getScore().then(updateScoreMessage);

  //todo: init controls
}

startup();
