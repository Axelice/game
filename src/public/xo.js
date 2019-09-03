function randomPosition(max) {
  return Math.floor(Math.random() * max);
}

export function xo() {
  const ss = Math.random();
  const runRound = ({ board, yourSymbol, otherSymbol }) => {
    console.log('----', ss);
    for (let posX = 0; posX < 3; posX++) {
      let countYourPositions = 0;
      let countOtherPositions = 0;
      const emptyPositions = [];
      for (let posY = 0; posY < 3; posY++) {
        if (yourSymbol === board[posX][posY]) {
          countYourPositions++;
        } else if (otherSymbol !== board[posX][posY]) {
          emptyPositions.push({ posX, posY });
        } else {
          countOtherPositions++;
        }
      }

      if (countYourPositions === 2 && emptyPositions.length) {
        return emptyPositions.pop();
      }

      if (countOtherPositions === 2 && emptyPositions.length) {
        return emptyPositions.pop();
      }
    }

    const emptyPositions = [];
    for (let posX = 0; posX < 3; posX++) {
      for (let posY = 0; posY < 3; posY++) {
        if (board[posX][posY] === undefined) {
          emptyPositions.push({ posX, posY });
        }
      }
    }

    return emptyPositions[randomPosition(emptyPositions.length)];
  };

  return runRound;
}
