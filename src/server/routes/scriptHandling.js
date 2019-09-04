const fs = require("fs");
const { parse } = require("querystring");
const highlight = require("highlight-javascript-syntax");

module.exports = function(app) {
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

      if (!fs.existsSync(file)) {
        fs.openSync(file, "wx");
      }

      fs.writeFileSync(file, code);

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
};
