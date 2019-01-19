import React from "react";
import keydown from 'react-keydown';
 

export default class Screen extends React.Component {

  constructor() 
  {
    super();
    this.state = {
      screen: {
        height: window.innerHeight,
        width: window.innerWidth,
        // ratio: window.devicePixelRatio || 1,
        ratio: 1,
      },
      xPos: 100,
      yPos: 400,
      yVelo : 1,
      context: null,
    framerate: 24,
  beginTime: 0,
endtime: 0,};

  };
    

  render() {
    // console.log("rendering screen");
    return (
      <div>
           <canvas 
           ref="canvas"
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
    // console.log("frame updating");
    

    // window.setTimeout(function() (console.log("frame delay")), 500);
    this.setState({endTime: Date.now()});
    if (this.state.endTime - this.state.beginTime < 1000/24-10)
    {
      
    }
    else
    {
      this.setState({beginTime: Date.now()});
      // console.log(Date.now());
      // update a frame

      // update coordinates
      this.setState({yPos: this.state.yPos+this.state.yVelo});
      // do boundary checks

      // draw frame

      const context = this.state.context;

      // define frame stuff
      context.save();
      context.scale(this.state.screen.ratio, this.state.screen.ratio);
  
  
      // clear frame
      context.fillStyle = '#888888';
      // context.globalAlpha = 0.4;
      context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
      // context.globalAlpha = 1;
  
      context.fillStyle = '#ffffff';
      context.font = "30px Arial";
      context.fillText("lmao xD", this.state.xPos, this.state.yPos);
  
  
      context.restore();
    }

    requestAnimationFrame(() => {this.update()});
    

  }


  @keydown( 's' ) // or specify `which` code directly, in this case 13
  moveDown( event ) 
  {
    console.log("s pressed!");
    
    this.setState({yVelo: this.state.yVelo-5});
    console.log("new y:" + this.state.yPos);
  }

  @keydown( 'w' ) // or specify `which` code directly, in this case 13
  submit( event ) 
  {
    console.log("w pressed!")
    this.setState({yPos: this.state.yPos-5});
    console.log("new y:" + this.state.yPos);
  }
}
