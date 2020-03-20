const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  destination: {
    type: String,
    required: true,
    trim: false
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  owner: {
    type: String,
    required: true
  }
});

const Trip = mongoose.model("trip", TripSchema);

module.exports = Trip;
