const express = require("express");
const vm = require("vm");
const fs = require("fs");

const app = express();
const port = 3000;

const getFinalResults = (games, result) => {
  let counter = 0;
  games.forEach(element => {
    if(element.winner === result){
      counter++
    }
  });
  return counter;
}

var dir = "./tmp";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.set("view engine", "ejs");

app.use(express.static("src/public"));

require("./routes/scriptHandling.js")(app);

const { runGame: runShips } = require("./games/runShips.js");
app.get("/resultsShip", (req, res) => {
  let firstScript = fs.readFileSync(`${dir}/firstScript/shipScrip.js`, "utf8");
  firstScript += "return {runRound, getShips};";
  let secondScript = fs.readFileSync(
    `${dir}/secondScript/shipScrip.js`,
    "utf8"
  );
  secondScript += "return {runRound, getShips};";
  const firstRunnerContext = vm.createContext({});
  const secondRunnerContext = vm.createContext({});

  const firstActions = vm.compileFunction(
    firstScript,
    [],
    firstRunnerContext
  )();
  const secondActions = vm.compileFunction(
    secondScript,
    [],
    secondRunnerContext
  )();
  let result = runShips([
    {
      playerId: "first",
      actions: firstActions
    },
    {
      playerId: "second",
      actions: secondActions
    }
  ]);
  if (!result) {
    result = "draw";
  }
  const page = {
    winner: result.winner,
    firstPlayerBoard: result.boardList[0]
      .map(line =>
        line.map(place => (place === undefined ? " ~ " : place)).join(" ")
      )
      .join("<br>"),
    secondPlayerBoard: result.boardList[1]
      .map(line =>
        line.map(place => (place === undefined ? " ~ " : place)).join(" ")
      )
      .join("<br>")
  };
  res.end(`
      <!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
          <h1>Ships winner: ${page.winner}</h1>
          <h2>First player board</h2>
          <p>
            ${page.firstPlayerBoard}
          </p>
          <h2>Second player board</h2>
          <p>
            ${page.secondPlayerBoard}
          </p>
      </body>
      </body>
      </html>
      `);

  let games = [{
    id: 1,
    gameName: "X&0",
    winner: "Player 1"
  },{
    id: 2,
    gameName: "X&0",
    winner: "Player 2"
  }, {
    id: 3,
    gameName: "X&0",
    winner: "Player 2"
  },{
    id: 4,
    gameName: "X&0",
    winner: "Player 2"
  },{
    id: 5,
    gameName: "X&0",
    winner: "Draw"
  }];

  const total = {
    player1: getFinalResults(games, "Player 1"),
    player2: getFinalResults(games, "Player 2"),
    draw:getFinalResults(games, "Draw"),
  }

  res.render("index.ejs", {games, total});
});

app.get("/resultsX0", (req, res) => {
  let games = [{
    id: 1,
    gameName: "X&0",
    winner: "Player 1"
  },{
    id: 2,
    gameName: "X&0",
    winner: "Player 2"
  }, {
    id: 3,
    gameName: "X&0",
    winner: "Player 2"
  },{
    id: 4,
    gameName: "X&0",
    winner: "Player 2"
  },{
    id: 5,
    gameName: "X&0",
    winner: "Draw"
  }];

  const total = {
    player1: getFinalResults(games, "Player 1"),
    player2: getFinalResults(games, "Player 2"),
    draw:getFinalResults(games, "Draw"),
  }

  res.render("index.ejs", {games, total});
})


app.get("/rankingsX&0", (req, res) => {

  let results = [{
    id: 1,
    gameName: "X&0",
    player: "Player 1",
    wins:10
  },{
    id: 2,
    gameName: "X&0",
    player: "Player 2",
    wins:8
  }, {
    id: 3,
    gameName: "X&0",
    player: "Player 3",
    wins:7
  },{
    id: 4,
    gameName: "X&0",
    player: "Alberto",
    wins: 4
  },{
    id: 6,
    gameName: "X&0",
    player: "Maurice",
    wins:3
  },{
    id: 7,
    gameName: "X&0",
    player: "Ciro",
    wins:1
  }];

  res.render("rankings.ejs", {results});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
