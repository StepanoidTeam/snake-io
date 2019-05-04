import { Cell } from "./components/index.js";
//duplicate
const fieldSizeCells = 30; // чем больше число тем больше матрица, то есть размер поля для змеи

export function initBoard() {
  const boardSize = Cell.sizePx * fieldSizeCells;
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
