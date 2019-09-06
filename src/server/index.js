const express = require("express");
const vm = require('vm');
const fs = require("fs");

const app = express();
const port = 3000;


var dir = "./tmp";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.set('view engine', 'ejs');

app.use(express.static("src/public"));

require('./routes/scriptHandling.js')(app);

const { runGame: runXO } = require('./games/runX0.js');
app.get("/resultsX0", (req, res) => {
  let firstScript = fs.readFileSync(`${dir}/firstScript/script.js`, 'utf8');
  firstScript += 'return runRound;';
  let secondScript = fs.readFileSync(`${dir}/secondScript/script.js`, 'utf8');
  secondScript += 'return runRound;';
  const firstRunnerContext = vm.createContext({});
  const secondRunnerContext = vm.createContext({});

  const firstRunner = vm.compileFunction(firstScript, [], firstRunnerContext);
  const secondRunner = vm.compileFunction(firstScript, [], secondRunnerContext);
  let result = runXO([firstRunner, secondRunner])
  if (!result) {
    result = 'draw';
  }
  var todos = [];
  todos.push(result);
  res.render("index.ejs", {todos});
});

const { runGame: runShips } = require('./games/runShips.js');
app.get("/resultsShip", (req, res) => {
  let firstScript = fs.readFileSync(`${dir}/firstScript/shipScrip.js`, 'utf8');
  firstScript += 'return {runRound, getShips};';
  let secondScript = fs.readFileSync(`${dir}/secondScript/shipScrip.js`, 'utf8');
  secondScript += 'return {runRound, getShips};';
  const firstRunnerContext = vm.createContext({});
  const secondRunnerContext = vm.createContext({});

  const firstActions = vm.compileFunction(firstScript, [], firstRunnerContext)();
  const secondActions = vm.compileFunction(secondScript, [], secondRunnerContext)();
  let result = runShips([{
    playerId: 'first',
    actions: firstActions
  }, {
    playerId: 'second',
    actions: secondActions,
  }])
  if (!result) {
    result = 'draw';
  }
  res.json(result);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
