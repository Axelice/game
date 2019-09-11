import React from "react";
import { StaticRouter, Link, Switch, Route } from "react-router-dom";
import { renderToString } from "react-dom/server";

import ShipIndex from "./games/ships/ShipIndex";

class Layout extends React.Component {
  render() {
    return (
      <StaticRouter context={{}} location={this.props.url}>
        <div>
          <div>
            <Link to="/app/ships">Ships</Link>
          </div>
          <Switch>
            <Route path="/app/ships" component={ShipIndex} />
            <Route path="*" render={() => <h1>404</h1>} />
          </Switch>
        </div>
      </StaticRouter>
    );
  }
}

export function getPage(url) {
  const jsx = <Layout url={url} />;
  const reactDom = renderToString(jsx);

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>React SSR</title>
        </head>
        
        <body>
            <div id="app">${reactDom}</div>
            <script src="./app.bundle.js"></script>
        </body>

        </html>
    `;
}
