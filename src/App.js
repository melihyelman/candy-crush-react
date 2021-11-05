import { useEffect, useState } from "react";
import Modal from "react-modal";

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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "75%",
    height: "75%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

export const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [score, setScore] = useState(0);
  const [countTouch, setCountTouch] = useState(0);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const colorArrangement = loadBoard(width, candyColors, () => setScore(0));
    fetch("https://6183021b91d76c00172d172d.mockapi.io/users")  .then(response => response.json())
  .then(data => setUsers(data)).catch((error) => {
  console.error('Error:', error);
});

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
      checkForColumnOfFour(width, currentColorArrangement, () =>
        setScore(() => score + 4)
      );
      checkForRowOfFour(currentColorArrangement, () =>
        setScore(() => score + 4)
      );
      checkForColumnOfThree(width, currentColorArrangement, () =>
        setScore(() => score + 3)
      );
      checkForRowOfThree(currentColorArrangement, () =>
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
  useEffect(() => {
    sessionStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = (user) => {
    fetch('https://6183021b91d76c00172d172d.mockapi.io/users', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(user),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
  }

  const handleRestart = () => {
    const name = window.prompt("Enter your name")
    setUsers([
      ...users,
      { name: name, score: score },
    ]);
    addUser({ name: name, score: score })
    const colorArrangement = loadBoard(width, candyColors, () => setScore(0));

    setCurrentColorArrangement(colorArrangement);
  };
  const handleTouch = (e) => {
    if (countTouch === 0) {
      setSource(e.target);
      setCountTouch(1);
    } else if (countTouch === 1) {
      const destinationId = parseInt(e.target.getAttribute("data-id"));
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
        currentColorArrangement[sourceId] = e.target.getAttribute("src");
      }

      const isARowOfThree = checkForRowOfThree(
        currentColorArrangement,
        () => {}
      );
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
        setCountTouch(0);
        setSource(null);
      } else {
        currentColorArrangement[destinationId] = e.target.getAttribute("src");
        currentColorArrangement[sourceId] = source.getAttribute("src");
        setCountTouch(0);
        setSource(null);
        setCurrentColorArrangement([...currentColorArrangement]);
      }
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <div className="score">
        <h1>Score: {score}</h1>
        <div>
          <button className="btn" onClick={() => handleRestart()}>
            Restart
          </button>
          <button className="btn user" onClick={openModal}>
            Users
          </button>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <button className="btn" onClick={closeModal}>
              close
            </button>
            <ul className="userList">
              <li>Name - Score</li>
              {users.length > 0  &&
                users
                  .sort((first, second) => second.score - first.score)
                  .map((user) => (
                    <li>
                      <span>{user.name}</span>
                      <span>{user.score}</span>
                    </li>
                  ))}
            </ul>
          </Modal>
        </div>
      </div>
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            className={
              index === parseInt(source?.getAttribute("data-id"))
                ? "selected"
                : ""
            }
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            onTouchEnd={handleTouch}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
