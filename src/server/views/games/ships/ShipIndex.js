import React from "react";
import { Switch, Route } from "react-router-dom";

import ShipSave from "./ShipSave";

const ShipIndex = ({ match }) => (
  <React.Fragment>
    <div>TT</div>
    <Switch>
      <Route path={`${match.path}/add`} exact component={ShipSave} />
    </Switch>
  </React.Fragment>
);

export default ShipIndex;
