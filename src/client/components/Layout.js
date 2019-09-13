import React from "react";
import { StaticRouter, Link, Switch, Route } from "react-router-dom";
import { renderToString } from "react-dom/server";

import ShipIndex from "./games/ships/ShipIndex";

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/app/ships">Ships</Link>
        </div>
        <Switch>
          <Route path="/app/ships" component={ShipIndex} />
          <Route path="*" render={() => <h1>404</h1>} />
        </Switch>
      </div>
    );
  }
}
