const { GRID_LENGTH } = require('../config.js');


const randomNumber = () => Math.floor(Math.random() * GRID_LENGTH);

const initNewPlayer = () => ({
  snakeCoords: [
    {
      x: randomNumber(),
      y: randomNumber(),
    },
  ],
  direction: 0,
});

const getNextSquare = (player) => {
  let y = player.snakeCoords[0].y;
  let x = player.snakeCoords[0].x;
  switch (player.direction) {
    case 0:
      y = player.snakeCoords[0].y <= 0 ? GRID_LENGTH - 1 : player.snakeCoords[0].y - 1; break;
    case 1:
      x = player.snakeCoords[0].x <= 0 ? GRID_LENGTH - 1 : player.snakeCoords[0].x - 1; break;
    case 2:
      y = player.snakeCoords[0].y >= GRID_LENGTH - 1 ? 0 : player.snakeCoords[0].y + 1; break;
    case 3:
      x = player.snakeCoords[0].x >= GRID_LENGTH - 1 ? 0 : player.snakeCoords[0].x + 1; break;
  }

  return { x, y };
};

const initNewGame = () => ({
  food: {
    x: randomNumber(),
    y: randomNumber(),
  },
  player: initNewPlayer(),
  game_over: false,
});

const nextStep = (currGame) => {
  const head = getNextSquare(currGame.player);
  if (head.x === currGame.food.x && head.y === currGame.food.y) {
    currGame.food = {
      x: randomNumber(),
      y: randomNumber(),
    };
  } else {
    currGame.player.snakeCoords.pop();
  }
  for (let i = 0; i < currGame.player.snakeCoords.length; i++) {
    const coord = currGame.player.snakeCoords[i];
    if (coord.x === head.x && coord.y === head.y) {
      currGame.game_over = true;
    }
  }
  if (!currGame.game_over) {
    currGame.player.snakeCoords.unshift(head);
  }
  return currGame;
};

module.exports = { initNewGame, nextStep };
