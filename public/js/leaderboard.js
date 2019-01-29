// check if high score; if so, send it
var userID = "idk";

get('/api/whoami', {}, function (user) {
    loadScores(0, user);
});

function loadScores(difficulty, user) {
    let data = {
        contentID: "guest",
        difficultyID: difficulty,
        name: "guest",
    }
    if (user && user._id) {
        console.log("setting ID to actual ID");
        data = {
            contentID: user._id,
            difficultyID: difficulty,
            name: user.name,
        };
    }

    console.log("fetching high scores with id: " + data.contentID);
    get('/api/personalHighScores', data, function (scores) {
        console.log("the high scores found: " + scores);
        for (i = 1; i <= 5; i++) {
            console.log(i);
            ele = document.getElementById("m" + i);
            cell = document.createElement('td');
            cell.innerText = scores[i - 1];
            ele.appendChild(cell);
        }
    });
    if (difficulty < 4) {
        loadScores(difficulty + 1, user);
    }
    else
    {
        loadGeneralScores(0);
    }
}

function loadGeneralScores(difficulty) {
    console.log("fetching general score, " + difficulty + "  difficulty");
    let data = {
        difficultyID: difficulty,
    }
    console.log("fetching high scores with id: " + data.contentID);
    get('/api/generalHighScores', data, function (scores) {
        console.log("the high scores found: " + scores[0].name );
        for (i = 1; i <= 5; i++) {
            console.log(i);
            ele = document.getElementById("general" + i);
            cell = document.createElement('td');
            if (scores[i-1].name === undefined)
            {
                cell.innerText = "Guest " + " " + scores[i-1].score;
            }
            else
            {
                cell.innerText = scores[i - 1].name + " " + scores[i-1].score;
            }
            ele.appendChild(cell);
        }
    });
    if (difficulty < 4) {
        loadGeneralScores(difficulty + 1);
    }
}