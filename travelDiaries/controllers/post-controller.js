var mongoose = require("mongoose");
var Post = require("../models/Post");
var User = require("../models/User");

exports.getAllPosts = function (req, res) {
  var posts;
  Post.find()
    .populate("user")
    .exec(function (err, foundPosts) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected Error Occurred" });
      }
      posts = foundPosts;
      return res.status(200).json({ posts: posts });
    });
};

exports.addPost = function (req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var location = req.body.location;
  var date = req.body.date;
  var image = req.body.image;
  var user = req.body.user;

  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !location ||
    location.trim() === "" ||
    !date ||
    !user ||
    !image ||
    image.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Data" });
  }

  User.findById(user, function (err, existingUser) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    var post = new Post({
      title: title,
      description: description,
      image: image,
      location: location,
      date: new Date(date),
      user: user,
    });

    mongoose.startSession(function (err, session) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected Error Occurred" });
      }
      session.startTransaction();
      existingUser.posts.push(post);
      existingUser.save({ session: session }, function (err) {
        if (err) {
          console.log(err);
          session.abortTransaction();
          session.endSession();
          return res
            .status(500)
            .json({ message: "Unexpected Error Occurred" });
        }
        post.save({ session: session }, function (err, savedPost) {
          if (err) {
            console.log(err);
            session.abortTransaction();
            session.endSession();
            return res
              .status(500)
              .json({ message: "Unexpected Error Occurred" });
          }
          session.commitTransaction();
          session.endSession();
          return res.status(201).json({ post: savedPost });
        });
      });
    });
  });
};

exports.getPostById = function (req, res) {
  var id = req.params.id;

  Post.findById(id, function (err, post) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }
    return res.status(200).json({ post: post });
  });
};

exports.updatePost = function (req, res) {
  var id = req.params.id;
  var title = req.body.title;
  var description = req.body.description;
  var location = req.body.location;
  var image = req.body.image;

  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !location ||
    location.trim() === "" ||
    !image ||
    image.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Data" });
  }

  var update = {
    title: title,
    description: description,
    image: image,
    location: location,
  };

  Post.findByIdAndUpdate(id, update, function (err, post) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
    if (!post) {
      return res.status(500).json({ message: "Unable to update" });
    }
    return res.status(200).json({ message: "Updated Successfully" });
  });
};

exports.deletePost = function (req, res) {
  var id = req.params.id;

  mongoose.startSession(function (err, session) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
    session.startTransaction();
    Post.findById(id)
      .populate("user")
      .exec(function (err, post) {
        if (err) {
          console.log(err);
          session.abortTransaction();
          session.endSession();
          return res
            .status(500)
            .json({ message: "Unexpected Error Occurred" });
        }
        if (!post) {
          session.abortTransaction();
          session.endSession();
          return res.status(500).json({ message: "Unable to delete" });
        }
        var user = post.user;
        user.posts.pull(post);
        user.save({ session: session }, function (err) {
          if (err) {
            console.log(err);
            session.abortTransaction();
            session.endSession();
            return res
              .status(500)
              .json({ message: "Unexpected Error Occurred" });
          }
          Post.findByIdAndRemove(id, function (err) {
            if (err) {
              console.log(err);
              session.abortTransaction();
              session.endSession();
              return res
                .status(500)
                .json({ message: "Unexpected Error Occurred" });
            }
            session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: "Deleted Successfully" });
          });
        });
      });
  });
};
