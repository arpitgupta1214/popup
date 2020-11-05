const mongoose = require("mongoose");

const smtpSchema = new mongoose.Schema({
    host: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
   category: {
        type: String,
        required: true,
    }
  });
  module.exports = mongoose.model("Smtp", smtpSchema);