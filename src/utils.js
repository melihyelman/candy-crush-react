import Blank from "./img/blank.png";
export const loadBoard = (width, candyColors, cb) => {
  const randomColorArrangement = [];
  for (let i = 0; i < width * width; i++) {
    const randomColor =
      candyColors[Math.floor(Math.random() * candyColors.length)];
    randomColorArrangement.push(randomColor);
  }
  cb();
  return randomColorArrangement;
};

export const checkForColumnOfThree = (width, currentColorArragement, cb) => {
  for (let i = 0; i <= 47; i++) {
    const columnOfThree = [i, i + width, i + width * 2];
    const decidedColor = currentColorArragement[i];

    if (
      columnOfThree.every((i) => currentColorArragement[i] === decidedColor)
    ) {
      cb();
      columnOfThree.forEach((i) => (currentColorArragement[i] = Blank));
      return true;
    }
  }
};

export const checkForColumnOfFour = (width, currentColorArragement, cb) => {
  for (let i = 0; i <= 39; i++) {
    const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
    const decidedColor = currentColorArragement[i];

    if (columnOfFour.every((i) => currentColorArragement[i] === decidedColor)) {
      cb();
      columnOfFour.forEach((i) => (currentColorArragement[i] = Blank));
      return true;
    }
  }
};

export const checkForRowOfThree = (currentColorArragement, cb) => {
  for (let i = 0; i < 64; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedColor = currentColorArragement[i];
    const notValid = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
    ];

    if (notValid.includes(i)) continue;

    if (rowOfThree.every((i) => currentColorArragement[i] === decidedColor)) {
      cb();
      rowOfThree.forEach((i) => (currentColorArragement[i] = Blank));
      return true;
    }
  }
};

export const checkForRowOfFour = (currentColorArragement, cb) => {
  for (let i = 0; i < 64; i++) {
    const rowOfFour = [i, i + 1, i + 2, i + 3];
    const decidedColor = currentColorArragement[i];
    const notValid = [
      5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
      54, 55, 62, 63, 64,
    ];

    if (notValid.includes(i)) continue;

    if (rowOfFour.every((i) => currentColorArragement[i] === decidedColor)) {
      cb();
      rowOfFour.forEach((i) => (currentColorArragement[i] = Blank));
      return true;
    }
  }
};

export const moveIntoSquareBelow = (
  width,
  candyColors,
  currentColorArragement
) => {
  for (let i = 0; i <= 55; i++) {
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    const isFirstRow = firstRow.includes(i);

    if (isFirstRow && currentColorArragement[i] === Blank) {
      currentColorArragement[i] =
        candyColors[Math.floor(Math.random() * candyColors.length)];
    }
    if (currentColorArragement[i + width] === Blank) {
      currentColorArragement[i + width] = currentColorArragement[i];
      currentColorArragement[i] = Blank;
    }
  }
};
