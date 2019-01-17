import React from "react";
import "../css/app.css"

export default class GameTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"title"}>React Snake</div>
    );
  }
}
