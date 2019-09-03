const SYMBOL_X = "X";
const SYMBOL_Y = "Y";

const checkWinner = function(gameState) {
  for (let posX = 0; posX < 3; posX++) {
    let countX = 0;
    let countY = 0;

    for (let posY = 0; posY < 3; posY++) {
      if (SYMBOL_X === gameState[posX][posY]) {
        countX++;
      } else if (SYMBOL_Y === gameState[posX][posY]) {
        countY++;
      }
    }

    if (countX === 3) {
      return SYMBOL_X;
    } else if (countY === 3) {
      return SYMBOL_Y;
    }
  }

  for (let posY = 0; posY < 3; posY++) {
    let countX = 0;
    let countY = 0;

    for (let posX = 0; posX < 3; posX++) {
      if (SYMBOL_X === gameState[posX][posY]) {
        countX++;
      } else if (SYMBOL_Y === gameState[posX][posY]) {
        countY++;
      }
    }

    if (countX === 3) {
      return SYMBOL_X;
    } else if (countY === 3) {
      return SYMBOL_Y;
    }
  }
};

export function runGame(players) {
  const gameState = [];
  for (var i = 0; i < 3; i++) {
    gameState.push([, ,]);
  }

  const playersRunner = [
    { symbol: SYMBOL_X, runner: players[0]() },
    { symbol: SYMBOL_Y, runner: players[1]() }
  ];

  let winner;
  let rounds = 0;
  while (!winner && rounds < 5) {
    rounds++;
    playersRunner.forEach(({ runner, symbol }) => {
      try {
        const play = runner({
          board: gameState,
          yourSymbol: symbol,
          otherSymbol: symbol === SYMBOL_Y ? SYMBOL_X : SYMBOL_Y
        });
        if (play) {
          gameState[play.posX][play.posY] = symbol;
        }
      } catch (error) {
        console.log(error);
        debugger;
      }
    });
    winner = checkWinner(gameState);
  }
  return winner;
}
