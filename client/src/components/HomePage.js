import React from "react";
import "../css/homepage.css"
import "../css/app.css"
import Link from "react-router-dom/es/Link";
// import Title from "./Title";

export default class HomePage extends React.Component {
  render() {
    return (
      <div className={"center"}>
        <div className={"title"}>Flappy Tim</div>
        <Link to="/rules" className={"button"}>Rules</Link>
        <div className={"button"} onClick={this.props.onClickStart}>Start</div>
      </div>
    );
  }
}
