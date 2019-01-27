function startGame() {
    myGameArea.start();
    scene = new Scene();
    jump = new Sound("jump.mp3");
    scene.start();
}

var img = document.getElementById("tim");

var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 975; // any longer breaks things on small screens
        this.canvas.height = 660;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(update, 10);
        this.keySetList = [["w"], ["f", "j"]];
        for (i = 0; i<this.keySetList.length ; i++)
        {
            for (j = 0; j<this.keySetList[i].length ; j++)
            {
                console.log(i +" " + j + this.keySetList[i][j]);
                this.keySetList[i][j] = (this.keySetList[i][j]).charCodeAt(0);
            }
        }
        console.log(this.keySetList);
        this.keySet = this.keySetList[0];
        this.keyToPress = this.keySet[0];
        this.timHeight = img.height;
        this.timWidth = img.width;
        this.frameCount = 0;
        this.startTime = Date.now();
        this.endTime = Date.now();
        this.pipeDeath = false;
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
// function sound(src) {
//     this.sound = document.createElement("audio");
//     this.sound.src = src;
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.play = function(){
//         this.sound.play();
//     }
//     this.stop = function(){
//         this.sound.pause();
//     }    
// }
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
            overlay_inner.removeChild(change);   

            myGameArea.frameCount = 0;
            myGameArea.start();
        })
        overlay_inner.appendChild(restart);

        //creating change difficulties button
        const change = document.createElement('button')
        change.id = "change"
        change.innerText = "Change Difficulty";
        change.type = "button";
        change.className = "btn btn-lg btn-warning change";
        change.addEventListener('click', function () {

            //stop the overlay
            document.getElementById("overlay").style.display = "none";
            //eliminate eveything that was just created (otherwise they will show up twice)
            overlay_inner.removeChild(div_title);
            overlay_inner.removeChild(score);
            overlay_inner.removeChild(restart);
            overlay_inner.removeChild(home);
            overlay_inner.removeChild(change);

            // myGameArea.frameCount = 0;
            // myGameArea.start();
            //render the level setting
            renderLevels();
        })
        overlay_inner.appendChild(change);

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
    myGameArea.pipe1.x = myGameArea.pipe1.x - 4;
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

    if (myGameArea.pipeDeath == true)
    {
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
}

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
// jump = new sound("jump.mp3");

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

function Sound(src) {
    //sound effect class
    //builds a sound effect based on a url
    //may need both ogg and mp3.
    this.snd = document.createElement("audio");
    this.snd.src = src;
    //preload sounds if possible (won't work on IOS)
    this.snd.setAttribute("preload", "auto");
    //hide controls for now
    this.snd.setAttribute("controls", "none");
    this.snd.style.display = "none";
    //attach to document so controls will show when needed
    document.body.appendChild(this.snd);

    this.play = function () {
        this.snd.play();
    } // end play function

    this.showControls = function () {
        //generally not needed.
        //crude hack for IOS
        this.snd.setAttribute("controls", "controls");
        this.snd.style.display = "block";
    } // end showControls

} // end sound class def
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
const number_of_levels = 5;
level_name = ["baby", "beginner", "intermediate", "advanced", "Chuck Norris"];
function renderLevels() {
    overlay.style.display = "block";
    for(let i = 0; i < number_of_levels; i ++ ){
        const level = document.createElement('button')
        level.id = "level" + i; 
        level.innerText = level_name[i];
        level.type = "button";
        level.className = "btn btn-danger btn-lg";
        level.addEventListener('click', function () {

            //stop the overlay
            document.getElementById("overlay").style.display = "none";
            //eliminate eveything that was just created (otherwise they will show up more than once)
            for ( j = 0; j < number_of_levels; j++ ){
                const remove_button = document.getElementById("level" + j);
                const remove_space = document.getElementById("space" + j);
                overlay_inner.removeChild(remove_space);
                overlay_inner.removeChild(remove_button);
            }
            myGameArea.frameCount = 0;
            myGameArea.start();
        })
        const space = document.createElement('hr');
        space.id = "space" + i
        // space.innerText = "";
        overlay_inner.appendChild(level);
        overlay_inner.appendChild(space)
        
    }    
}
