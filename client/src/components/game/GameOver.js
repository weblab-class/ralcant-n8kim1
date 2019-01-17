import React from "react"
import "../../css/app.css"

export default class GameOver extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"game-over-modal center"}>
        <div className={"game-over-text"}>Game Over!</div>
      </div>
    )
  }

}