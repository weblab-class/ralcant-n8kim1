// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Score = require('../models/score');
const Score2 = require('../models/score2');

const router = express.Router();

// api endpoints
router.get('/whoami', function (req, res) {
  if (req.isAuthenticated()) {
    res.send(req.user);
  }
  else {
    res.send({});
  }
});

router.get('/user', function (req, res) {
  User.findOne({ _id: req.query._id }, function (err, user) {
    res.send(user);
  });
});

router.post(
  '/score',
  // connect.ensureLoggedIn(),
  function (req, res) {
    // console.log("in apis.js");
    const newScore = new Score({
      'googleid': req.body.contentID,
      'score': req.body.content,
    });

    newScore.save(function (err, score) {
      // console.log("saved???");
      // configure socketio
      if (err) { console.log("failed to save, " + err) }
      else { console.log("saved sucess? id " + newScore.googleid) };
    });

    res.send({});
  }
);

router.get('/score', function (req, res) {
  // console.log("trying to fetch score, id " + req.query.contentID);
  Score.find({ googleid: req.query.contentID }).lean().exec(function (err, scores) {
    if (scores.length == 0) {
      console.log("no scores found; sending 0");
      res.send([0]);
    }
    else {
      var maxScore = 0;
      // console.log(scores.length + " scores found");
      for (let i = 0; i < scores.length; i++) {
        // console.log("the score object # " + i);
        // console.log("the score is " + scores[i].score);
        if (scores[i].score > maxScore) {
          maxScore = scores[i].score;
        }
      }
      // console.log("fetched max score: "+maxScore );
      res.send([maxScore]);
    }
  });

});

router.post(
  '/score2',
  // connect.ensureLoggedIn(),
  function (req, res) {
    console.log("in apis.js");
    const newScore2 = new Score2({
      'googleid': req.body.contentID,
      'score': req.body.content,
      'difficultyID': req.body.difficultyID,
      'name': req.body.name
    });

    newScore2.save(function (err, score2) {
      // console.log("saved???");
      // configure socketio
      if (err) { console.log("failed to save, " + err) }
      else { console.log("saved sucess? id " + newScore2.googleid + " difficulty " + newScore2.difficultyID) };
    });

    // purge scores
    // Score2.deleteMany({ difficultyID: 4 }, function (err) {console.log("guests purged")});

    res.send({});
  }
);

router.get('/score2', function (req, res) {
  console.log("trying to fetch score2 w diff " + req.query.difficultyID + ", id " + req.query.contentID);
  Score2.find({ googleid: req.query.contentID, difficultyID: req.query.difficultyID }).lean().exec(function (err, scores) {
    if (scores.length == 0) {
      console.log("no scores found; default to 0");
      res.send([0]);
    }
    else {
      var maxScore = 0;
      console.log(scores.length + " scores found");
      for (let i = 0; i < scores.length; i++) {
        console.log("the score2 object # " + i);
        console.log("the score2 is " + scores[i].score);
        if (scores[i].score > maxScore) {
          maxScore = scores[i].score;
        }
      }

      console.log("fetched max score: " + maxScore);
      res.send([maxScore]);
    }
  });
});

router.get('/personalHighScores', function (req, res) {
  console.log("trying to fetch 5 scores w diff " + req.query.difficultyID + ", id " + req.query.contentID);
  Score2.find({ googleid: req.query.contentID, difficultyID: req.query.difficultyID }).lean().exec(function (err, scores) {

    // strip to array of scores
    for (i = 0; i < scores.length; i++) {
      // console.log("name: " + scores[i].name + " , score: " +scores[i].score);
      scores[i] = parseInt(scores[i].score);
    }


    // return top 5
    scores.sort(function (a, b) { return b - a });

    scores.length = 5;

    res.send(scores);

  });
});

router.get('/generalHighScores', function (req, res) {
  // console.log("trying to fetch 5 general scores w diff " + req.query.difficultyID  );
  // Score2.find({ difficultyID: req.query.difficultyID }).lean().exec(function (err, scores) {
  Score2.find({ difficultyID: req.query.difficultyID }).exec(function (err, scores) {

    // return top 5
    scores.sort(function (a, b) { return b.score - a.score });
    scores.length = 5;

    res.send(scores);


  });
});

router.get('/allScores', function (req, res) {
  console.log("getting all scores ");
  Score2.find().lean().exec(function (err, scores) {
    console.log("finding all scores ");
    scores.sort(function (a, b) {
      if (a.name == undefined)
      {return 1;}
      if (b.name == undefined)
      { return -1;}
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();

      if (b > a) { return -1; }
      else { return 1 };
    });
    for (i = 0; i < scores.length; i++) {
      console.log("name: " + scores[i].name + ", diff: " + scores[i].difficultyID + ", score: " + scores[i].score);

    }

    res.send({});
  });
});


module.exports = router;