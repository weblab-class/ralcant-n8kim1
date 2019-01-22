// import node modules
const mongoose = require('mongoose');

// define a schema
const ScoreSchema = new mongoose.Schema ({
  googleid     	: String,
  score: Number,
});

// compile model from schema
module.exports = mongoose.model('ScoreModel', ScoreSchema);
