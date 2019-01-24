// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Score = require('../models/score');


const router = express.Router();

// api endpoints
router.get('/whoami', function(req, res) {
  if(req.isAuthenticated()){
    res.send(req.user);
  }
  else{
    res.send({});
  }
});

router.get('/user', function(req, res) {
  User.findOne({ _id: req.query._id }, function(err, user) {
    res.send(user);
  });
});

router.post(
  '/score',
  // connect.ensureLoggedIn(),
  function(req, res) {
    console.log("in apis.js");
    const newScore = new Score({
      'googleid'     	: req.body.contentID,
      'score': req.body.content,
    });

    newScore.save(function(err,score) {
      // console.log("saved???");
      // configure socketio
      if (err) {console.log("failed to save, " + err)}
      else {console.log("saved sucess? id "+ newScore.googleid)};
    });

    res.send({});
  }
);

router.get('/score', function(req, res) {
  console.log("trying to fetch score, id " + req.query.contentID);
  Score.find({googleid: req.query.contentID}).lean().exec( function (err, scores) 
  {
    var maxScore = 0;
    console.log(scores.length + " scores found");
    for (let i =0; i<scores.length; i++)
    {
      console.log("the score object # " + i);
      console.log("the score is " + scores[i].score);
      if (scores[i].score>maxScore)
      {
        maxScore= scores[i].score;
      }
    }

    console.log("fetched max score: "+maxScore );
    res.send([maxScore]);
  });

});

/*

router.post(
  '/story',
  connect.ensureLoggedIn(),
  function(req, res) {
    User.findOne({ _id: req.user._id },function(err,user) {
      const newStory = new Story({
        'creator_id': user._id,
        'creator_name': user.name,
        'content': req.body.content,
      });

      user.set({ last_post: req.body.content });
      user.save(); // this is OK, because the following lines of code are not reliant on the state of user, so we don't have to shove them in a callback. 

      newStory.save(function(err,story) {
        // configure socketio
        if (err) console.log(err);
      });

      res.send({});
    });
  }
);

router.get('/comment', function(req, res) {
  Comment.find({ parent: req.query.parent }, function(err, comments) {
    res.send(comments);
  })
});

router.post(
  '/comment',
  connect.ensureLoggedIn(),
  function(req, res) {
    User.findOne({ _id: req.user._id }, function (err, user) {
      const newComment = new Comment({
        'creator_id': user._id,
        'creator_name': user.name,
        'parent': req.body.parent,
        'content': req.body.content,
      });

      newComment.save(function(err, comment) {
        if (err) console.log(err);
      });

      res.send({});
    });
  }
); */
module.exports = router;