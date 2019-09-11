import React from "react";
import { Link, Switch, Route } from "react-router-dom";
import { renderToString } from "react-dom/server";

import ShipIndex from "./games/ships/ShipIndex";

class Layout extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/ships">Ships</Link>
        </div>
        <Switch>
          <Route path="/ships" exact component={ShipIndex} />
        </Switch>
      </div>
    );
  }
}

export default function getPage() {
  const jsx = <Layout />;
  const reactDom = renderToString(jsx);

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>
        
        <body>
            <div id="app">${reactDom}</div>
            <script src="./app.bundle.js"></script>
        </body>
        </html>
    `;
}
