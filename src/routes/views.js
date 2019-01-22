// dependencies
const express = require('express');
const router = express.Router();

// public endpoints
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'src/views' });
});

router.get('/game', function(req, res, next) {
  res.sendFile('game.html', { root: 'src/views' });
});

router.get('/rules', function(req, res, next) {
  res.sendFile('rules.html', { root: 'src/views' });
});
router.get('/about', function(req, res, next){
  res.sendFile('about.html', {root: 'src/views'})
});

router.get('/tim', function(req, res, next){
  res.sendFile('timSprite.png', {root: 'src/views'})
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/u/profile', function(req, res) {
  res.sendFile('profile.html', { root: 'src/views' });
});

module.exports = router;
