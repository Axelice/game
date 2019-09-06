const BOARD_SIZE = 10;
const ROUNDS_TO_DRAW = 100;
const SHIP_NUM = 3;
const SHIP_SIZE = 4;
// const PLAYER_WON = "PLAYER_WON";
const PLAYER_LOST = "PLAYER_LOST";
const SHIPS_ARE_VALID = "SHIPS_ARE_VALID";
const SHIPS_COUNT_NOT_VALID = "SHIPS_COUNT_NOT_VALID";
const SHIPS_PARTS_NOT_VALID = "SHIPS_PARTS_NOT_VALID";
const SHIPS_NOT_VALID = "SHIPS_NOT_VALID";
const SHIPS_OVERLAP = "SHIPS_OVERLAP";
const HIT = "x";
const EMPTY = "-";

/**
 * shipPart = {
 *  pos: {
 *    posX: Number 0 to BOARD_SIZE - 1
 *    posY: Number 0 to BOARD_SIZE - 1
 *  }
 * }
 * shipList = [[shipPart], [shipPart], ...] length is SHIP_NUM
 *
 *
 * players = {
 *  playerId,
 *  actions: {
 *    getShips,
 *    runRound,
 *  }
 * }
 *
 *
 */

const checkBoardIsCleared = function(board) {
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const boardPosValue = board[x][y];
      if (boardPosValue !== undefined && Number.isInteger(boardPosValue)) {
        return false;
      }
    }
  }
  return true;
};

const checkWinner = function(board) {
  return checkBoardIsCleared(board);
};

const checkIsIntSmallerThan = function(val, max) {
  return Number.isInteger(val) && val < max;
};

const checkPos = function({ posX, posY }) {
  try {
    return (
      checkIsIntSmallerThan(posX, BOARD_SIZE) &&
      checkIsIntSmallerThan(posY, BOARD_SIZE)
    );
  } catch (e) {
    return false;
  }
};

const checkShips = function(shipsList) {
  try {
    const isShipsLengthValid = shipsList.length === SHIP_NUM;

    const areShipsValid = shipsList.every(ship => {
      const isSizeValid = ship.length === SHIP_SIZE;

      const isShipPosValid = ship.every(pos => checkPos(pos));

      return isSizeValid && isShipPosValid;
    });

    if (!isShipsLengthValid) {
      return SHIPS_COUNT_NOT_VALID;
    } else if (!areShipsValid) {
      return SHIPS_PARTS_NOT_VALID;
    }
    return SHIPS_ARE_VALID;
  } catch (e) {
    return SHIPS_NOT_VALID;
  }
};

const generateEmptyBoard = function() {
  const board = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    board[x] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      board[x][y] = undefined;
    }
  }
  return board;
};

const checkBoardPlacement = function(board) {
  let shipPartsCount = 0;
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (Number.isInteger(board[x][y])) {
        shipPartsCount++;
      }
    }
  }
  return shipPartsCount === SHIP_NUM * SHIP_SIZE;
};

const getBoardWithShips = function(shipList) {
  const board = generateEmptyBoard();
  shipList.forEach((ship, shipId) => {
    ship.forEach(({ posX, posY }) => {
      board[posX][posY] = shipId;
    });
  });

  return board;
};

function runGame(players) {
  const boardList = [];
  let winner;

  // checks ships
  // places ships on board
  players.forEach(({ playerId, actions: { getShips } }, index) => {
    try {
      const shipList = getShips(BOARD_SIZE);
      const shipCheckValue = checkShips(shipList);
      if (shipCheckValue !== SHIPS_ARE_VALID) {
        throw new Error(`${playerId}'s ships are invalid. ${shipCheckValue}`);
      }

      const board = getBoardWithShips(shipList);
      if (!checkBoardPlacement(board)) {
        throw new Error(`${playerId}'s ships are invalid. ${SHIPS_OVERLAP}`);
      }

      boardList.push(board);
    } catch (e) {
      console.log(e);
      winner = playerId;
    }
  });

  let rounds = 0;
  const alreadyHitList = [HIT, EMPTY];
  while (!winner) {
    rounds++;
    players.forEach(({ actions: { runRound } }, playerIndex) => {
      try {
        const otherPlayerIndex = (playerIndex + 1) % 2;
        const otherPlayerBoard = boardList[otherPlayerIndex];
        const firePos = runRound({
          board: otherPlayerBoard.slice()
        });

        if (!checkPos(firePos)) {
          winner = players[otherPlayerIndex].playerId;
        }

        if (
          !alreadyHitList.includes(otherPlayerBoard[firePos.posX][firePos.posY])
        ) {
          if (Number.isInteger(otherPlayerBoard[firePos.posX][firePos.posY])) {
            otherPlayerBoard[firePos.posX][firePos.posY] = HIT;
          } else {
            otherPlayerBoard[firePos.posX][firePos.posY] = EMPTY;
          }
        }

        if (checkWinner(otherPlayerBoard)) {
          winner = players[otherPlayerIndex].playerId;
        }
      } catch (error) {
        console.log(error);
        debugger;
      }
    });
  }
  console.log("****************");
  console.log(boardList[0].map(line => line.join(" ")));
  console.log("################");
  console.log(boardList[1].map(line => line.join(" ")));
  console.log("****************");
  return winner;
}

module.exports = {
  runGame
};
