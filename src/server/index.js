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
app.get("/testShip", (req, res) => {
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

function getPlayerActions(email, game) {
  let script = fs.readFileSync(`${dir}/${email}/${game}Scrip.js`, "utf8");
  script += "return {runRound, getShips};";
  const context = vm.createContext({});
  const actions = vm.compileFunction(script, [], context)();

  return actions;
}

function getPlayers() {
  let players = fs
    .readdirSync(`${dir}`, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(dir => dir.name);

  return players;
}

app.get("/resultsShip/:email", (req, res) => {
  const currentPlayer = req.params.email;
  const players = getPlayers();
  const GAME_SHIP = "ship";

  const currentPlayerActions = getPlayerActions(currentPlayer, GAME_SHIP);

  const results = players
    .filter(player => player !== currentPlayer)
    .map(player => {
      const playerActions = getPlayerActions(player, GAME_SHIP);
      let result = runShips([
        {
          playerId: currentPlayer,
          actions: currentPlayerActions
        },
        {
          playerId: player,
          actions: playerActions
        }
      ]);

      const parsedResult = {
        winner: result.winner,
        secondPlayer: player,
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
      return parsedResult;
    });

  res.end(`
      <!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
        <h1>Player: ${currentPlayer}</h1>
        ${parseResults(currentPlayer, results)}
      </body>
      </body>
      </html>
      `);
});

function parseResults(currentPlayer, results) {
  return results.map(result => {
    return `
      <div>
        <div style="display: inline-block; width: 160px;">
          <h3>You</h3>
          <p style="color: ${result.winner === currentPlayer ? "red" : "green"}">
            ${result.firstPlayerBoard}
          </p>
        </div>
        <div style="display: inline-block; width: 160px; margin-left: 15px; padding-left:50px; border-left: 1px solid gray;">
          <h3>${result.secondPlayer}</h3>
          <p style="color: ${result.winner !== currentPlayer ? "red" : "green"}">
            ${result.secondPlayerBoard}
          </p>
        </div>
      </div>`;
  });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
