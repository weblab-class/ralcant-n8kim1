function startGame() {
    myGameArea.start();
}

var img = document.getElementById("tim");



var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 1470 // might make dynamic
        this.canvas.height = 660;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(update, 5);
        this.keySet = [83, 87];
        this.keyToPress = this.keySet[0];
        this.timHeight = img.height;
        this.timWidth = img.width;
        this.frameCount = 0;
        this.startTime = Date.now();
        this.endTime = Date.now();
        this.state = {
            isGameOver: false,
            xPos: 100,
            yPos: 200,
            yVelo: 0,
            score: 0
        };
        this.pipe1 = {
            x: this.canvas.width/2 ,
            y: 125,
            height: 150,
            width: 25,
            yMax: 350,
            yMin: 50,
            scored: false,
        };
        this.pipe2 = {
            x: this.canvas.width,
            y: 125,
            height: 150,
            width: 25,
            yMax: 350,
            yMin: 50,
            scored: false,
        };
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

// if item 'seenGameOver' is undefined, this sets it up a value of "false"
// const seenGameOver = window.localStorage.getItem('seenGameOver');

// console.log(seenGameOver);
// if (!seenGameOver) {
//     window.localStorage.setItem('seenGameOver', "false");
//     console.log(window.localStorage.getItem('seenGameOver'));
// }
// console.log(window.localStorage.getItem('seenGameOver'));
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
const overlay_inner = document.getElementById('text');

function update() {
    // update a frame...

    var width = myGameArea.canvas.width;
    var height = myGameArea.canvas.height;

    // halt frame updates if game over
    if (this.isGameOver() == true) {
    
        myGameArea.stop();

        // timing
        myGameArea.endTime = Date.now();
        console.log("Framerate: " + (myGameArea.endTime - myGameArea.startTime) / myGameArea.frameCount);

        const div_title = document.createElement('h1')
        div_title.id = "Game_Over_title";
        div_title.innerText ="Game Over! :(";
        div_title.className = "game_over_text";
        overlay_inner.appendChild(div_title);

        const score = document.createElement('h1')
        score.innerText = "Your score is: " + myGameArea.state.score;
        score.id = "Game_Over_score";
        overlay_inner.appendChild(score);

        //creating home button
        const home = document.createElement('a')
        home.id = "home"
        home.innerText = "Home";
        home.role = "button";
        home.className = "btn btn-primary btn-lg home";
        home.href = "/"
        overlay_inner.appendChild(home);

        //creating restart button
        const restart = document.createElement('button')
        restart.id = "restart"
        restart.innerText = "Restart";
        restart.type = "button";
        restart.className = "btn btn-danger btn-lg btn-secondary restart";
        restart.addEventListener('click', function() {

            //stop the overlay
            document.getElementById("overlay").style.display = "none";
            //eliminate eveything that was just created (otherwise they will show up twice)
            overlay_inner.removeChild(div_title);
            overlay_inner.removeChild(score);
            overlay_inner.removeChild(restart);
            overlay_inner.removeChild(home);   

            myGameArea.frameCount = 0;
            myGameArea.start();
        })
        overlay_inner.appendChild(restart);

        //show an overlay
        overlay.style.display = "block";

        // check if high score; if so, send it
        var userID = "idk";
        get('/api/whoami', {}, function (user) {
            console.log("fetching score, id: " + user._id);
            let data = {
                contentID: "guest",
            }
            if (user._id) {
                console.log("setting ID to actual ID");
                data = {
                    contentID: user._id,
                };
            }
            console.log("fetching score with id: " + data.contentID);
            get('/api/score', data, function (score) {
                console.log("the high score found: " + score[0]);
                get('/api/whoami', {}, function (user) {
                    console.log(user._id);
                    if (myGameArea.state.score >= score[0]) {
                        if (!user._id) {
                            const data = {
                                contentID: "guest",
                                content: myGameArea.state.score
                            };
                            post('/api/score', data);
                        }
                        else {
                            const data = {
                                contentID: user._id,
                                content: myGameArea.state.score
                            };
                            console.log("posting score while logged in");
                            post('/api/score', data);
                        }
                        console.log("high score posted! the score: " + myGameArea.state.score)
                    }
                });
            }
            );
        });

        // restart box
        // myGameArea.context.fillStyle = '#ffffff';
        // myGameArea.context.font = "12px Arial";
        // myGameArea.context.fillRect(125, 175, 50, 50);
        // myGameArea.context.fillStyle = '#000000';
        // myGameArea.context.fillText("restart?", 100, 200);

        // myGameArea.context.restore(); // render everything yay
        return 0;
    }   

    // timing and other game initialziation info
    myGameArea.frameCount += 1;
    if (myGameArea.frameCount == 1) {
        myGameArea.startTime = Date.now();
        var rect = myGameArea.canvas.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);

    }


    // take key input
    if (myGameArea.keys && myGameArea.keys[myGameArea.keyToPress]) {
        // console.log("key pressed");
        myGameArea.state.yVelo = myGameArea.state.yVelo - 2;
        var oldKey = myGameArea.keyToPress;
        // pick a new, distinct key
        while (oldKey == myGameArea.keyToPress) {
            // console.log("regen key");
            myGameArea.keyToPress = myGameArea.keySet[Math.floor(Math.random() * myGameArea.keySet.length)];
        }
    }

    // update coordinates of tim
    myGameArea.state.yVelo = myGameArea.state.yVelo + 0.005;
    if (myGameArea.state.yVelo > 2) {
        myGameArea.state.yVelo = 2;
    }
    if (myGameArea.state.yVelo < -0.5) {
        myGameArea.state.yVelo = -0.5;
    }
    myGameArea.state.yPos = myGameArea.state.yPos + myGameArea.state.yVelo;

    // update coordinates of pipes
    myGameArea.pipe1.x = myGameArea.pipe1.x - 2;
    if (myGameArea.pipe1.x + myGameArea.pipe1.width < myGameArea.state.xPos && myGameArea.pipe1.scored == false) {
        console.log("Score from pipe 1");
        myGameArea.state.score += 1;
        myGameArea.pipe1.scored = true;
    }
    if (myGameArea.pipe1.x < -1 * myGameArea.pipe1.width) {
        console.log("Regen pipe 1");
        myGameArea.pipe1.x = width; // push to the end
        myGameArea.pipe1.scored = false;
        myGameArea.pipe1.y = getRandomInt(myGameArea.pipe1.yMin, myGameArea.pipe1.yMax)  // randomize the height of the opening
    }

    myGameArea.pipe2.x = myGameArea.pipe2.x - 2;
    if (myGameArea.pipe2.x + myGameArea.pipe2.width < myGameArea.state.xPos && myGameArea.pipe2.scored == false) {
        console.log("Score from pipe 2");
        myGameArea.state.score += 1;
        myGameArea.pipe2.scored = true;
    }
    if (myGameArea.pipe2.x < -1 * myGameArea.pipe2.width) {
        console.log("Regen pipe 2");
        myGameArea.pipe2.x = width; // push to the end
        myGameArea.pipe2.scored = false;
        myGameArea.pipe2.y = getRandomInt(myGameArea.pipe2.yMin, myGameArea.pipe2.yMax)  // randomize the height of the opening
    }

    // draw frame
    const context = myGameArea.context;

    // define frame stuff
    context.save();

    // clear frame
    context.fillStyle = '#365879';
    context.fillRect(0, 0, width, height);

    // display tim
    context.fillStyle = '#ffffff';
    context.font = "30px Arial";
    context.drawImage(img, myGameArea.state.xPos, myGameArea.state.yPos);
    // context.fillText("lmao xD", myGameArea.state.xPos, myGameArea.state.yPos);

    // display pipes
    myGameArea.context.fillStyle = '#000000';
    myGameArea.context.fillRect(myGameArea.pipe1.x, 0, myGameArea.pipe1.width, myGameArea.pipe1.y);
    myGameArea.context.fillRect(myGameArea.pipe1.x, myGameArea.pipe1.y + myGameArea.pipe1.height, myGameArea.pipe1.width, height);
    myGameArea.context.fillRect(myGameArea.pipe2.x, 0, myGameArea.pipe2.width, myGameArea.pipe2.y);
    myGameArea.context.fillRect(myGameArea.pipe2.x, myGameArea.pipe2.y + myGameArea.pipe2.height, myGameArea.pipe2.width, height);

    // display key to press
    myGameArea.context.fillStyle = 'yellow';
    myGameArea.context.font = "24px Arial";
    myGameArea.context.fillStyle = 'yellow';
    myGameArea.context.fillText("Key: " + String.fromCharCode(myGameArea.keyToPress), 125, 75);

    // display score
    myGameArea.context.fillStyle = 'yellow';
    myGameArea.context.fillText("Score: " + myGameArea.state.score, 125, 115);

    context.restore();

}

function isGameOver() {
    if (myGameArea.state.yPos + myGameArea.timHeight > myGameArea.canvas.height) {
        // fell too far down
        console.log("fell down");
        return true;
    };

    if (isInside2(myGameArea.state.xPos, myGameArea.state.yPos, myGameArea.pipe1.x - myGameArea.timWidth, 0, myGameArea.pipe1.width + myGameArea.timWidth, myGameArea.pipe1.y)) {
        console.log("hit top of pipe 1");
        return true;
    };

    if (isInside2(myGameArea.state.xPos, myGameArea.state.yPos, myGameArea.pipe1.x - myGameArea.timWidth, myGameArea.pipe1.y + myGameArea.pipe1.height - myGameArea.timHeight, myGameArea.pipe1.width + myGameArea.timWidth, myGameArea.canvas.height - myGameArea.pipe1.y - myGameArea.pipe1.height)) {
        console.log("hit bottom of pipe 1");
        return true;
    };


    if (isInside2(myGameArea.state.xPos, myGameArea.state.yPos, myGameArea.pipe2.x - myGameArea.timWidth, 0, myGameArea.pipe2.width + myGameArea.timWidth, myGameArea.pipe2.y)) {
        console.log("hit top of pipe 2");
        return true;
    };

    if (isInside2(myGameArea.state.xPos, myGameArea.state.yPos, myGameArea.pipe2.x - myGameArea.timWidth, myGameArea.pipe2.y + myGameArea.pipe2.height - myGameArea.timHeight, myGameArea.pipe2.width + myGameArea.timWidth, myGameArea.canvas.height - myGameArea.pipe2.y - myGameArea.pipe2.height)) {
        console.log("hit bottom of pipe 2");
        return true;
    };

    return false;
}


// // restart if game over
// var restartRect = {
//     x: 100,
//     y: 175,
//     width: 100,
//     height: 50
// };
// //Binding the click event on the canvas
// myGameArea.canvas.addEventListener('click', function (evt) {
//     var mousePos = getMousePos(myGameArea.canvas, evt);
//     console.log("x " + mousePos.x + ", y " + mousePos.y);
//     // if (isGameOver()==true) {
//     if ((isInside(mousePos, restartRect)) && (isGameOver() == true)) {
//         console.log('restart button clicked inside rect');
//         myGameArea.frameCount = 0;
//         myGameArea.start();
//     }

// }, false);


// helpers for clicks
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX,
        y: event.clientY
    };
}
function isInside(pos, rect) {
    return (pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y);
}
function isInside2(posX, posY, rectX, rectY, rectW, rectH) {
    return (posX > rectX && posX < rectX + rectW && posY < rectY + rectH && posY > rectY);
}

// const newSound = document.getElementById("jump");
jump = new sound("jump.mp3");

//making keypresses work
window.addEventListener('keydown', function (e) {
    e.preventDefault();
    myGameArea.keys = (myGameArea.keys || []);
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
    jump.play();
})
window.addEventListener('keyup', function (e) {
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
})


// helper for RNG
function getRandomInt(min, max) {
    return (min + Math.floor(Math.random() * Math.floor(max - min)));
}


// function on() {
//     document.getElementById("overlay").style.display = "block";
//  }
  
// function off_game() {
//     document.getElementById("overlay").style.display = "none";
//     const game_over = document.getElementById("Game_Over_title");
//     const score = document.getElementById("Game_Over_score");
//     overlay_inner.removeChild(game_over);
//     overlay_inner.removeChild(score);
// }

function init(){
    scene = new Scene();
    jump = new sound("jump.mp3");
    scene.start();
} 

