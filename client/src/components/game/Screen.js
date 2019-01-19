import React from "react";

export default class Screen extends React.Component {
  constructor() {
    super();
    this.state = {
      screen: {
        height: window.innerHeight,
        width: window.innerWidth,
        ratio: window.devicePixelRatio || 1,
      },
      context: null}}

  render() {
    console.log("rendering screen");
    return (
      <div>
           <canvas ref="canvas"
           height={this.state.screen.height * this.state.screen.ratio}
          width={this.state.screen.width * this.state.screen.ratio}
            />  
      </div>
    );
  }

  componentDidMount() {

    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    // this.startGame();
    requestAnimationFrame(() => {this.update()});
  }

  update() {
    const context = this.state.context;

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);
    context.font = "30px Arial";
    context.fillText("Hello World", 10, 50);
    context.restore();

    // Next frame
    requestAnimationFrame(() => {this.update()});
  }
}
