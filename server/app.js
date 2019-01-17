const express = require("express");
const path = require("path");
const api = require("./api");
const { initNewGame, nextStep } = require("./game");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const publicPath = path.resolve(__dirname, "..", "client", "dist");

let gameInterval;
const gameTick = 300;
let gameStarted = false;
let numConnected = 0;

app.use("/api", api );
app.use(express.static(publicPath));

app.get(["/rules"], (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

http.listen(3000, () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});

let game = {};


const getNextGameState = () => {
  if (!game.game_over) {
    game = nextStep(game);
    io.emit("update_game", game);
  }
};


// Websocket shenanigans

io.on("connection", (socket) => {
  numConnected += 1;
  console.log("a user connected they are user number " + numConnected);
  if (!gameStarted) {
    game = initNewGame();
    gameInterval = setInterval(
      () => {
        getNextGameState();
      },
      gameTick,
    );
    socket.emit("new_game", game);
    gameStarted = true;
  }

  socket.on("move", (direction) => {
    if ((direction - game.player.direction) % 2 !== 0){
      game.player.direction = direction;
    }
  });

  socket.on("disconnect", () => {
    console.log("a user dced");
    numConnected -= 1;
    clearInterval(gameInterval)
    if (numConnected === 0) {
      gameStarted = false;
    }
  })
});




