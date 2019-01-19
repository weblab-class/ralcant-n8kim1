import React from "react";
import HomePage from "./HomePage";
import Screen from "./game/Screen.js";

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStatus: 0,
    };

    this.changeGameState = (newStatus) => {
      this.setState({gameStatus: newStatus});
    };
  }

  render() {
    switch (this.state.gameStatus) {
      case 0:
      console.log("home page loaded; in case 0");
        return (
          <HomePage onClickStart={() => {this.changeGameState(1);}}>
          </HomePage>
        );
      case 1:
      console.log("home page loaded; in case 1 -- pls");
        return (
          <Screen />
          // <div>
          //   Gameplay div
          // </div>
        );
    }
  }


}