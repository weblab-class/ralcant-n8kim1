// import node modules
const mongoose = require('mongoose');

// define a schema
const Score2Schema = new mongoose.Schema ({
  googleid     	: String,
  score: Number,
  difficultyID: Number,
  name: String
});

// compile model from schema
module.exports = mongoose.model('Score2Model', Score2Schema);
