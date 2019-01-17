import React from "react";
import "../../css/game.css"
import io from "socket.io-client";
import { GRID_LENGTH } from "../../../../config";
import GameOver from "./GameOver";
import Row from "./Row";

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:3000");
    this.socket.on("new_game", (msg) => {
      this.updateBoard(msg);
      document.addEventListener("keydown", this.keyDownBound);
    });

    this.socket.on("update_game", (msg) => {
      this.updateBoard(msg);
    });

    this.state = {
      isGameOver: false,
      boardContent: this.emptyBoard(),
    };
  }


  keyDownBound = (e) => {
    switch (e.key) {
      case "w":
        this.socket.emit("move", 0);
        break;
      case "a":
        this.socket.emit("move", 1);
        break;
      case "s":
        this.socket.emit("move", 2);
        break;
      case "d":
        this.socket.emit("move", 3);
        break;
    }
  };

  emptyBoard = () => {
    const rows = [];
    for (let rowNum = 0; rowNum < GRID_LENGTH; rowNum += 1) {
      rows.push([]); // push an empty row
      for (let colNum = 0; colNum < GRID_LENGTH; colNum += 1) {
        rows[rowNum].push(0);
      }
    }

    return rows;
  };

  updateBoard = (data) => {
    const newBoard = this.emptyBoard();
    newBoard[data.food.y][data.food.x] = 3;
    for (const i in data.player.snakeCoords) {
      newBoard[data.player.snakeCoords[i].y][data.player.snakeCoords[i].x] = 1;
    }
    this.setState({boardContent: newBoard});
    if (data.game_over) {
      this.setState({isGameOver: true});
    }
  };

  render() {

    const gameOverModal = this.state.isGameOver ? (<GameOver /> ) : (null);

    return (
      <div className="game-container">
        <div className="board">
          {Array.from(Array(GRID_LENGTH).keys()).map(y => (
            <Row
              rowContent={this.state.boardContent[y]}
              y={y}
              key={y}
            />
          ))}
        </div>
        {gameOverModal}
      </div>
    );
  }
}
