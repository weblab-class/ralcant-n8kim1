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

router.get('/self_leaderboard', function(req, res, next){
  res.sendFile('self_leaderboard.html', {root: 'src/views'})
});
router.get('/general_leaderboard', function(req, res, next){
  res.sendFile('general_leaderboard.html', {root: 'src/views'})
});

router.get('/tim', function(req, res, next){
  res.sendFile('timSprite.png', {root: 'src/views'})
});

router.get('/jump', function(req, res) {
  res.sendFile('jump.mp3', {root: 'src/views'})
});
router.get('/losing', function(req, res) {
  res.sendFile('losing.mp3', {root: 'src/views'})
});

router.get('/quickSilence', function(req, res) {
  res.sendFile('quickSilence.mp3', {root: 'src/views'})
});
router.get('/tim_transparent', function(req, res, next){
  res.sendFile('tim_transparent.png', {root: 'src/views'})
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
