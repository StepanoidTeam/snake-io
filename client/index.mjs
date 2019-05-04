import {} from "./wsClient.mjs";

import { setupControls } from "./controls/index.mjs";

let svg = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
); /*то что это маштабируемая векторная графика уже поняла....хотела сделать градиент змею*/
let svgns = "http://www.w3.org/2000/svg"; //НО ОБИДНО!!! не могу поменять змею и точку! научи....
let rectSize = 20; //чем больше число тем больше размер змеи, но матрица почему-то тоже увеличивается
let matrixSize = 30; // чем больше число тем больше матрица, то есть размер поля для змеи
let speedMs = 90; // чем больше число тем медленее скорость змеи
let scoreMessageBlock = document.querySelector(".high-scores");
const gameOverScreen = document.querySelector(".game-over");

gameOverScreen.setAttribute("hidden", true);

// тут наверное вызывается функция и ей передаются параметры. Пыталась добавить еще параметр,но игнорит
svg.setAttributeNS(
  null,
  "width",
  rectSize * matrixSize
); /* Тут ответ.Размер змеи умножается на рамер матрицы,поэтому происходит расширение матрицы при 
увеличении змеи */
svg.id = "game";
svg.setAttributeNS(null, "height", rectSize * matrixSize); // тоже самое, только увеличивается высота

document.body.appendChild(svg); // функция вызывает другую функцию

//Змея движется в пределах 600x на 600y
let currentX = 6; // изначальное положение змеи по x (горизонтально)
let currentY = 5; // изначальное положение змеи по y (вертикально)
let snakeLength = 2; // длина змеи

let move = 0; //Увеличивала значение,ничего не изменилось

let rectArray = []; // пустой массив

// пошел страшный код
function drawPoint(x, y) {
  let rect = [document.createElementNS(svgns, "rect"), x, y];
  let rectObj = rect[0];
  rectObj.setAttributeNS(null, "x", x * rectSize); //вроде как вызов функции с заданными параметрами
  rectObj.setAttributeNS(null, "y", y * rectSize); // не пойму зачем null.
  rectObj.setAttributeNS(null, "height", rectSize); // у нас в тесте вроде было похожее.
  rectObj.setAttributeNS(null, "width", rectSize); // Снчала стоял 0,но не прокатило.Поменяли на null
  rectObj.setAttributeNS(null, "fill", "#000"); // Но не поняла почему
  rectObj.setAttributeNS(null, "class", "snake");
  rectArray.push(rect);
  svg.appendChild(rectObj);
  if (rectArray.length > snakeLength) {
    svg.removeChild(rectArray[0][0]); //Oh my God
    rectArray.shift();
  }
}

let apple = null;
function setApple() {
  let appleX = Math.floor(Math.random() * matrixSize);
  let appleY = Math.floor(Math.random() * matrixSize);
  apple = [document.createElementNS(svgns, "rect"), appleX, appleY];
  apple[0].setAttributeNS(null, "x", appleX * rectSize);
  apple[0].setAttributeNS(null, "y", appleY * rectSize);
  apple[0].setAttributeNS(null, "height", rectSize);
  apple[0].setAttributeNS(null, "width", rectSize);
  apple[0].setAttributeNS(null, "fill", "#f00");
  svg.appendChild(apple[0]);
}

setApple();
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

async function sendScore(score = 0) {
  const rawResponse = await fetch("/setScore", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: "bob", score })
  });

  const scores = await rawResponse.json();
  return scores;
}

async function getScore() {
  const rawResponse = await fetch("/getScore", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const scores = await rawResponse.json();
  return scores;
}

let getInput = setupControls();

function controllingSnake() {
  let input = getInput();
  let nextX = currentX + input.x;
  let nextY = currentY + input.y;

  if (
    nextY < 0 ||
    nextY > matrixSize - 1 ||
    nextX < 0 ||
    nextX > matrixSize - 1
  ) {
    svg.setAttributeNS(null, "style", "border: 20px outset #696969;");

    clearInterval(timing);
    sendScore(snakeLength).then(updateScoreMessage);
    gameOverMessage("bob", snakeLength);

    return;
  }
  if ((currentX == apple[1]) & (currentY == apple[2])) {
    snakeLength++;
    svg.removeChild(apple[0]);
    setApple();
  }
  rectArray.forEach(function(element) {
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
