var svg = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
); /*то что это маштабируемая векторная графика уже поняла....хотела сделать градиент змею*/
var svgns = "http://www.w3.org/2000/svg"; //НО ОБИДНО!!! не могу поменять змею и точку! научи....
var rectSize = 20; //чем больше число тем больше размер змеи, но матрица почему-то тоже увеличивается
var matrixSize = 30; // чем больше число тем больше матрица, то есть размер поля для змеи
var speedMs = 90; // чем больше число тем медленее скорость змеи
var scoreMessageBlock = document.querySelector(".high-scores");
const gameOverScreen = document.querySelector(".game-over");

gameOverScreen.setAttribute("hidden", true);

// тут наверное вызывается функция и ей передаются параметры. Пыталась добавить еще параметр,но игнорит
svg.setAttributeNS(
  null,
  "width",
  rectSize * matrixSize
); /* Тут ответ.Размер змеи умножается на рамер матрицы,поэтому происходит расширение матрицы при 
увеличении змеи */

svg.setAttributeNS(null, "height", rectSize * matrixSize); // тоже самое, только увеличивается высота
svg.setAttributeNS(null, "style", "border: 20px inset #C71585;"); //размер,вид,цвет бордюра
document.body.appendChild(svg); // функция вызывает другую функцию

//Змея движется в пределах 600x на 600y
var currentX = 6; // изначальное положение змеи по x (горизонтально)
var currentY = 5; // изначальное положение змеи по y (вертикально)
var nextMoveX = 1; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится
var nextMoveY = 0; // ед.измерения след.шага.Если меняю на большие числа,то змея дробится
var snakeLength = 2; // длина змеи

var move = 0; //Увеличивала значение,ничего не изменилось

var rectArray = []; // пустой массив

// пошел страшный код
function drawPoint(x, y) {
  var rect = [document.createElementNS(svgns, "rect"), x, y];
  var rectObj = rect[0];
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

function setApple() {
  appleX = Math.floor(Math.random() * matrixSize);
  appleY = Math.floor(Math.random() * matrixSize);
  apple = [document.createElementNS(svgns, "rect"), appleX, appleY];
  apple[0].setAttributeNS(null, "x", appleX * rectSize);
  apple[0].setAttributeNS(null, "y", appleY * rectSize);
  apple[0].setAttributeNS(null, "height", rectSize);
  apple[0].setAttributeNS(null, "width", rectSize);
  apple[0].setAttributeNS(null, "fill", "#f00");
  svg.appendChild(apple[0]);
}

setApple();
var timing = setInterval(function() {
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

function controllingSnake() {
  var nextX = currentX + nextMoveX;
  var nextY = currentY + nextMoveY;

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

document.onkeydown = checkKey;
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == "38") {
    //up arrow
    nextMoveX = 0;
    nextMoveY = -1;
  } else if (e.keyCode == "40") {
    //down arrow
    nextMoveX = 0;
    nextMoveY = 1;
  } else if (e.keyCode == "37") {
    //left arrow
    nextMoveX = -1;
    nextMoveY = 0;
  } else if (e.keyCode == "39") {
    //right arrow
    nextMoveX = 1;
    nextMoveY = 0;
  }
}

function is_touch_device() {
  return (
    "ontouchstart" in window ||
    navigator.MaxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
function startup() {
  getScore().then(updateScoreMessage);

  if (is_touch_device()) {
    document.body.addEventListener("touchstart", handleStart, false);
    document.body.addEventListener("touchend", handleEnd, false);
  } else {
    console.log("Is not touch device");
  }
}
function handleStart(evt) {
  evt.preventDefault();
  tStartX = evt.touches[0].screenX;
  tStartY = evt.touches[0].screenY;
}
function handleEnd(evt2) {
  evt2.preventDefault();
  tEndX = evt2.changedTouches[0].screenX;
  tEndY = evt2.changedTouches[0].screenY;

  totalX = tStartX - tEndX;
  totalY = tStartY - tEndY;

  if (Math.abs(totalX) > Math.abs(totalY)) {
    totalX >= 0 ? (move = 4) : (move = 2);
  } else {
    totalY >= 0 ? (move = 1) : (move = 3);
  }

  if (move == 1) {
    //slide up
    nextMoveX = 0;
    nextMoveY = -1;
  } else if (move == 3) {
    //slide down
    nextMoveX = 0;
    nextMoveY = 1;
  } else if (move == 4) {
    //slide left
    nextMoveX = -1;
    nextMoveY = 0;
  } else if (move == 2) {
    //slide right
    nextMoveX = 1;
    nextMoveY = 0;
  }
}

startup();
