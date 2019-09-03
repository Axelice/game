const express = require("express");
const { parse } = require("querystring");
const highlight = require("highlight-javascript-syntax");
const vm = require('vm');

const app = express();
const port = 3000;

var fs = require("fs");
var dir = "./tmp";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use(express.static("src/public"));

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", chunk => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}

app.post("/saveScript", (req, res) => {
  collectRequestData(req, result => {
    const code = result.script.replace(/(\r\n|\n|\r)/gm, "");
    const emailDir = `./tmp/${result.email}`;
    const file = `${emailDir}/script.js`;

    if (!fs.existsSync(emailDir)) {
      fs.mkdirSync(emailDir);
    }

    fs.open(file, "wx", (err, fd) => {
      if (err) {
        if (err.code === "EEXIST") {
          console.error("myfile already exists");
          return;
        }

        throw err;
      }

      fs.writeFileSync(file, code);
    });

    res.end(`
        <!doctype html>
        <html>
        <head>
        <link rel="stylesheet" href="/highlight.css">
        </head>
        <body>
            ${highlight(code)}
        </body>
        </body>
        </html>
    `);
  });
});

const { runGame } = require('./runX0.js');

app.get("/results", (req, res) => {
  let firstScript = fs.readFileSync(`${dir}/firstScript/script.js`, 'utf8');
  firstScript += 'return runRound;';
  let secondScript = fs.readFileSync(`${dir}/secondScript/script.js`, 'utf8');
  secondScript += 'return runRound;';
  // console.log(firstScript);
  // console.log(secondScript);
  const firstRunnerContext = vm.createContext({});
  const secondRunnerContext = vm.createContext({});

  const firstRunner = vm.compileFunction(firstScript, [], firstRunnerContext);
  const secondRunner = vm.compileFunction(firstScript, [], secondRunnerContext);
  let result = runGame([firstRunner, secondRunner])
  if (!result) {
    result = 'draw';
  }
  res.json(result);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
