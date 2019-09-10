const fs = require("fs");
const { parse } = require("querystring");

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
      const code = result.script;
      const emailDir = `./tmp/${result.email}`;
      const file = `${emailDir}/shipScript.js`;

      if (!fs.existsSync(emailDir)) {
        fs.mkdirSync(emailDir);
      }

      if (!fs.existsSync(file)) {
        fs.openSync(file, "wx");
      }

      fs.writeFileSync(file, code);

      res.end(`
      <!DOCTYPE html>
      <html>
      <head>
      <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js"></script>
      <script>hljs.initHighlightingOnLoad();</script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/arta.min.css">
      </head>
      <body>
          <pre>
            <code class="javascript">
                ${code}
            </code>
          </pre>
          <a href="resultsShip/${result.email}"> Run vs others </a>
      </body>
      </body>
      </html>
      `);
    });
  });
};
