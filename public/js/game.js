// function startGame() {
//     myGameArea.start();
//     // scene = new Scene();
//     // jump = new Sound("jump.mp3");
//     // scene.start();
//     // renderLevels();
// }

var img = document.getElementById("tim");
difficulty = 0;
level_name = ["Baby", "Beginner", "Intermediate", "Advanced", "Chuck Norris"];
renderLevel_name =[ "Current level: baby", "Current level: Beginner", "Current level: Intermediate", "Current level: Advanced", "Current level: Chuck Norris"];
const losing = document.getElementById('losing');


var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 975; // any longer breaks things on small screens
        this.canvas.height = 660;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(update, 5);
        this.keySetList = ["FJ", "DFJK", "ASDFJKL", "QWERTYUIOPASDFGHJKLZXCVBNM", "QWERTYUIOPASDFGHJKLZXCVBNM"];
        var iMax = this.keySetList.length;
        for (i = 0; i < iMax; i++) {
            this.keySetList[i] = this.keySetList[i].split('');
            for (j = 0; j < this.keySetList[i].length; j++) {
                console.log(i + " " + j + this.keySetList[i][j]);
                this.keySetList[i][j] = (this.keySetList[i][j]).charCodeAt(0);
            }
        }
        console.log(this.keySetList);
        this.keySet = this.keySetList[difficulty];
        this.keyToPress = this.keySet[0]; // TODO randomize this
        this.timHeight = img.height;
        this.timWidth = img.width;
        this.frameCount = 0;
        this.startTime = Date.now();
        this.endTime = Date.now();
        this.pipeDeath = true;
        this.state = {
            isGameOver: false,
            xPos: 100,
            yPos: 200,
            yVelo: 0,
            score: 0
        };
        this.pipe1 = {
            x: this.canvas.width / 2,
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
// console.log(window.localStorage.getItem('seenGameOver'));
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


        // Dispatch the event.
        window.dispatchEvent(gameOverEvent);


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

        get('/api/whoami', {}, function (user) {
            console.log("fetching score2 (w difficulty), id: " + user._id);
            let data = {
                contentID: "guest",
                difficultyID: difficulty,
            }
            if (user._id) {
                console.log("setting ID to actual ID");
                data = {
                    contentID: user._id,
                    difficultyID: difficulty,
                };
            }

            console.log("fetching score2 with id: " + data.contentID);
            get('/api/score2', data, function (score) {
                console.log("the high score2 found: " + score[0]);
                get('/api/whoami', {}, function (user) {
                    console.log(user._id);
                    if (myGameArea.state.score >= score[0]) {
                        if (!user._id) {
                            const data = {
                                contentID: "guest",
                                content: myGameArea.state.score,
                                difficultyID: difficulty
                            };
                            post('/api/score2', data);
                        }
                        else {
                            const data = {
                                contentID: user._id,
                                content: myGameArea.state.score,
                                difficultyID: difficulty
                            };
                            console.log("posting score2 while logged in");
                            post('/api/score2', data);
                        }
                        console.log("high score2 posted! the score: " + myGameArea.state.score + " w diff " + difficulty );
                    }
                });
            }
            );
        });
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
        const jump = document.getElementById("jump");
        if (this.isGameOver() == false) {
            jump.pause();
            jump.currentTime = 0;
            jump.play();
        }
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
        console.log("fell down, yPos: " + myGameArea.state.yPos);
        return true;
    };

    if (myGameArea.pipeDeath == true) {
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
// const audio = document.getElementById("myAudio")

var isKeyDown = false;

//making keypresses work
window.addEventListener('keydown', function (e) {
    e.preventDefault();
    // console.log("key down");
    myGameArea.keys = (myGameArea.keys || []);
    if (isKeyDown == false) {
        isKeyDown = true;
        myGameArea.keys[e.keyCode] = (e.type == "keydown");
    }
})

window.addEventListener('keyup', function (e) {
    isKeyDown = false;
    // console.log("key up");
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
    // audio.pause();
});

// game over sound

var gameOverEvent = new Event('gameOverEvent');
const quickSilence = document.getElementById('quickSilence');
// Listen for the event.
window.addEventListener('gameOverEvent', function (e) {
    quickSilence.play();
    const losing = document.getElementById('losing');
    losing.play();
}, true);



// helper for RNG
function getRandomInt(min, max) {
    return (min + Math.floor(Math.random() * Math.floor(max - min)));
}

//create an element with certain properties
function create(type, id, text, className, href){
    const newElement = document.createElement(type);
    newElement.id = id;
    newElement.innerText = text;
    newElement.className = className;
    newElement.href = href;
    return newElement
}

function eliminate(button1, button2, button3, button4, button5, button6, id, parent){

    //stop the overlay
    document.getElementById(id).style.display = "none";
    
    //eliminate eveything that was just created (otherwise they will show up twice)
    parent.removeChild(button1);
    parent.removeChild(button2);
    parent.removeChild(button3);
    parent.removeChild(button4);
    parent.removeChild(button5);
    parent.removeChild(button6);    
};
function renderOptions() {

    const overlay_inner = document.getElementById('text');

    //crating title
    const div_title = create('h1', "Game_over_title", "Game Over! :(", "game_over_text", "#");
    overlay_inner.appendChild(div_title);

    //creating score
    const score = create('h1', "Game_Over_score", "Your score is " + myGameArea.state.score, "score", "#");
    overlay_inner.appendChild(score);

    //creating home button
    const home = create('a', "home", "Home", "btn btn-primary btn-lg home", "/");
    home.role = "button";
    overlay_inner.appendChild(home);

    //creating restart button
    const restart = create('button', "restart", "Restart","btn btn-danger btn-lg restart", "#" );
    restart.type = "button";
    restart.addEventListener('click', function () {
        eliminate(div_title, score, restart, home, change, myScores, "overlay", overlay_inner);
        myGameArea.frameCount = 0;
        losing.currentTime = 0;
        losing.pause();
        myGameArea.start();
    });
    overlay_inner.appendChild(restart);

    //creating change difficulties button
    const change = create('button', "change", "Change Difficulty", "btn btn-lg btn-warning change", "#");
    change.type = "button";
    change.addEventListener('click', function () {
        eliminate(div_title, score, restart, home, change, myScores, "overlay", overlay_inner);

        // myGameArea.frameCount = 0;
        // myGameArea.start();
        //render the level setting
        renderLevels();
    });
    overlay_inner.appendChild(change);

    //create link to self_leaderboard.html
    const myScores = create('a', "self_leaderboard", "See my scores", "btn btn-info btn-lg myScores", "/self_leaderboard")
    myScores.role = "button";
    myScores.addEventListener('click', function () {
        eliminate(div_title, score, restart, home, change, myScores, "overlay", overlay_inner);

        myGameArea.frameCount = 0;
    });
    overlay_inner.appendChild(myScores);

    // const generalScores = create('a', "general_leaderboard", "See general scores", "btn btn-info btn-lg generalScores", "/general_leaderboard");
    // generalScores.role = "button";
    // generalScores.addEventListener('click', function() {
    //     eliminate(div_title, score, restart, home, change, myScores, "overlay", overlay_inner);
    //     myGameArea.frameCount = 0;
    // });
    // overlay_inner.appendChild(generalScores);

    //show an overlay
    overlay.style.display = "block";
};

function renderCurrentLevel(i){
    const level = document.getElementById('currentLevel');
    level.innerText = renderLevel_name[i];
}

const number_of_levels = 5;

//show the different levels
function renderLevels() {
    overlay = document.getElementById("overlay");
    const overlay_inner = document.getElementById('text');
    overlay.style.display = "block";
    for (let i = 0; i < number_of_levels; i++) {
        const level = document.createElement('button')
        level.id = "level" + i;
        level.innerText = level_name[i];
        level.type = "button";
        level.className = "btn btn-danger btn-lg";
        level.addEventListener('click', function () {

            //stop the overlay
            document.getElementById("overlay").style.display = "none";
            //eliminate eveything that was just created (otherwise they will show up more than once)
            for (j = 0; j < number_of_levels; j++) {
                const remove_button = document.getElementById("level" + j);
                const remove_space = document.getElementById("space" + j);
                overlay_inner.removeChild(remove_space);
                overlay_inner.removeChild(remove_button);
            }
            myGameArea.frameCount = 0;

            //here there should be something like "myGameArea.start(i)" to see what game to display
            difficulty = i;

            losing.currentTime = 0;
            losing.pause();
            myGameArea.start();
            renderCurrentLevel(i);
        })
        const space = document.createElement('hr');
        space.id = "space" + i
        // space.innerText = "";
        overlay_inner.appendChild(level);
        overlay_inner.appendChild(space)

    }
}