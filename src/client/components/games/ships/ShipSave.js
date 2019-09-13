import React from "react";
import { Switch, Route } from "react-router-dom";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    console.log("$$$$$$$");
    event.preventDefault();
  }

  handleChange(event) {
    console.log('%%%%');
    debugger;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea onChange={this.handleChange}></textarea>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
