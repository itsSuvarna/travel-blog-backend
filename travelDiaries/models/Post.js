var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  // user: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  user: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);

