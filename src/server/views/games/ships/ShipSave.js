import React from "react";
import { Switch, Route } from "react-router-dom";

export default class Layout extends React.Component {
  // handleSubmit = formValues => {
  //   console.log(formValues);
  // };

  render() {
    return (
      <form onSubmit>
        <textarea></textarea>
        <button>Add Ship</button>
      </form>
    );
  }
}
