const mongoose = require('mongoose')
const Schema = mongoose.Schema

const strategyModel = new Schema({
  playerId: {
    type: String,
    required: [true, 'must have player id'],
    trim: true,
    unique: true,
  },
  Decisions: {
    type: Array,
    required: [true, 'must have decisions'],
    trim: true,
  },
})

const strat = mongoose.model('strategySchema', strategyModel)

module.exports = strat