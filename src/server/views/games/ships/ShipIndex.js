import React from "react";
import { Switch, Route } from "react-router-dom";

import ShipSave from "./ShipSave";

export default class Layout extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/shipsAdd" exact component={ShipSave} />
      </Switch>
    );
  }
}
