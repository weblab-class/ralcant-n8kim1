import React from "react";
import GameBoard from "./game/GameBoard";
import HomePage from "./HomePage";

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
        return (
          <HomePage onClickStart={() => {this.changeGameState(1);}} />
        );
      case 1:
        return (
          <GameBoard />
        );
    }
  }


}