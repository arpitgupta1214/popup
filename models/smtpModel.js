const mongoose = require("mongoose");

const smtpSchema = new mongoose.Schema({
  host: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  valid: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Smtp", smtpSchema);
