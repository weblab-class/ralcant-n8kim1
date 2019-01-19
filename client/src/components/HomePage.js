import React from "react";
// import Link from "react-router-dom/es/Link";

export default class HomePage extends React.Component {
  render() {
    return (
      <div className={"center"}>
        <div className={"title"}>Flappy Tim</div>
        <div className={"button"} onClick={this.props.onClickStart}>Start</div>
      </div>
    );
  }
}
