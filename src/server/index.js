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


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
