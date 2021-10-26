import { useEffect, useState } from "react";

import BlueCandy from "./img/blue-candy.png";
import RedCandy from "./img/red-candy.png";
import YellowCandy from "./img/yellow-candy.png";
import GreenCandy from "./img/green-candy.png";
import OrangeCandy from "./img/orange-candy.png";
import PurpleCandy from "./img/purple-candy.png";

import {
  checkForColumnOfFour,
  checkForColumnOfThree,
  checkForRowOfFour,
  checkForRowOfThree,
  loadBoard,
  moveIntoSquareBelow,
} from "./utils";

import "./App.css";

const width = 8;
const candyColors = [
  BlueCandy,
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy,
];

export const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const colorArrangement = loadBoard(width, candyColors, () => setScore(0));

    setCurrentColorArrangement(colorArrangement);
  }, []);

  const dragStart = (e) => {
    setSource(e.target);
  };

  const dragDrop = (e) => {
    setDestination(e.target);
  };

  const dragEnd = (e) => {
    const destinationId = parseInt(destination.getAttribute("data-id"));
    const sourceId = parseInt(source.getAttribute("data-id"));

    const validMoves = [
      sourceId - 1,
      sourceId + 1,
      sourceId - width,
      sourceId + width,
    ];

    const validMove = validMoves.includes(destinationId);

    if (validMove) {
      currentColorArrangement[destinationId] = source.getAttribute("src");
      currentColorArrangement[sourceId] = destination.getAttribute("src");
    }

    const isARowOfThree = checkForRowOfThree(currentColorArrangement, () => {});
    const isAColumnOfThree = checkForColumnOfThree(
      width,
      currentColorArrangement,
      () => {}
    );
    const isAColumnOfFour = checkForColumnOfFour(
      width,
      currentColorArrangement,
      () => {}
    );
    const isARowOfFour = checkForRowOfFour(currentColorArrangement, () => {});

    if (
      destinationId &&
      validMove &&
      (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)
    ) {
      setDestination(null);
      setSource(null);
    } else {
      currentColorArrangement[destinationId] = destination.getAttribute("src");
      currentColorArrangement[sourceId] = source.getAttribute("src");
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      await checkForColumnOfFour(width, currentColorArrangement, () =>
        setScore(() => score + 4)
      );
      await checkForRowOfFour(currentColorArrangement, () =>
        setScore(() => score + 4)
      );
      await checkForColumnOfThree(width, currentColorArrangement, () =>
        setScore(() => score + 3)
      );
      await checkForRowOfThree(currentColorArrangement, () =>
        setScore(() => score + 3)
      );
      await moveIntoSquareBelow(width, candyColors, currentColorArrangement);
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 200);

    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  return (
    <div className="app">
      <div className="score">
        <h1>Score: {score}</h1>
      </div>
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
