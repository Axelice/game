const getShips = function() {
  return [
    [
      { posX: 1, posY: 1 },
      { posX: 2, posY: 1 },
      { posX: 3, posY: 1 },
      { posX: 4, posY: 1 }
    ],
    [
      { posX: 5, posY: 3 },
      { posX: 6, posY: 3 },
      { posX: 7, posY: 3 },
      { posX: 8, posY: 3 }
    ],
    [
      { posX: 3, posY: 6 },
      { posX: 4, posY: 6 },
      { posX: 5, posY: 6 },
      { posX: 6, posY: 6 }
    ]
  ];
};

const runRound = function(board) {
  let steps = 0;
  let solution;
  while (steps < 5) {
    solution = {
      posX: Math.floor(Math.random() * 10),
      posY: Math.floor(Math.random() * 10)
    };

    console.log("%%%", board[posX][posY]);
    if (board[solution.posX][solution.posY] === undefined) {
      steps = 5;
    } else {
      steps++;
    }
  }
  return solution;
};
