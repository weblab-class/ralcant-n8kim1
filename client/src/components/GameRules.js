import React from "react";
import Title from "./Title";
import Link from "react-router-dom/es/Link";

export default class GameRules extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={"center"}>
        <Title />

        Rules are good. These are rules.
        <Link to="/" className={"button"}>Home</Link>

      </div>
    );
  }
}
