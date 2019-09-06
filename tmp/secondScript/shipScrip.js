const getShips = function() {
  return [
    [
      { posX: 1, posY: 1 },
      { posX: 1, posY: 2 },
      { posX: 1, posY: 3 },
      { posX: 1, posY: 4 }
    ],
    [
      { posX: 3, posY: 1 },
      { posX: 3, posY: 2 },
      { posX: 3, posY: 3 },
      { posX: 3, posY: 4 }
    ],
    [
      { posX: 5, posY: 1 },
      { posX: 5, posY: 2 },
      { posX: 5, posY: 3 },
      { posX: 5, posY: 4 }
    ],
  ];
};

const runRound = function(board) {
  return {
    posX: Math.floor(Math.random() * 10),
    posY:  Math.floor(Math.random() * 10),
  };
}


