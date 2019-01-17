import React from "react";
import "../../css/game.css";
import { GRID_LENGTH } from "../../../../config";
import Cell from "./Cell";

export default class Row extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="board-row">
        {Array.from(Array(GRID_LENGTH).keys()).map(x => (
          <Cell
            key={GRID_LENGTH*this.props.y + x}
            x={x}
            y={this.props.y}
            cellContent={this.props.rowContent[x]}
          />
        ))}
      </div>
    );
  }
}
