// dotenv
const dotenv = require('dotenv').config();

// libraries
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

// //line added for deployment
// require('dotenv').config();

// local dependencies
const db = require('./db');
const passport = require('./passport');
const views = require('./routes/views');
const api = require('./routes/api');


// initialize express app
const app = express();

// set POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable Cross Origin Requests (CORS)
app.use(cors());

// set up sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: 'false',
  saveUninitialized: 'true'
}));

// hook up passport
app.use(passport.initialize());
app.use(passport.session());

// set routes
app.use('/', views);
app.use('/api', api );
app.use('/static', express.static('public'));

// authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate(
    'google',
    {scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'],
     failureRedirect: '/login' }
  ),
  function(req, res) {
    res.redirect('/');
  }
);

// 404 route
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// route error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message + "test err msg",
  });
});
// port con fig
//const port = 3000; // config variab le
const port = (process.env.PORT || 3000);
const server = http.Server(app);
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});
// server.listen(process.env.PORT || 5000)
// http.listen( port , () =>{
//   console.log("Listening on port 3000" );
// });