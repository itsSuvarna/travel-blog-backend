const bcrypt = require("bcryptjs");
const User = require("../models/User");
exports.getAllUsers = function(req, res) {
  var users;
  User.find()
    .then(function(foundUsers) {
      users = foundUsers;
      res.status(200).json({ users: users });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json({ message: "Unexpected Error Occured" });
    });
};

exports.getUserById = function(req, res) {
  var id = req.params.id;
  User.findById(id)
    .populate("posts")
    .then(function(user) {
      if (!user) {
        res.status(404).json({ message: "No user found" });
      } else {
        res.status(200).json({ user: user });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json({ message: "Unexpected Error Occured" });
    });
};

exports.signup = function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  
  if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.length < 6) {
    res.status(422).json({ message: "Invalid Data" });
    return;
  }

  var hashedPassword = bcrypt.hashSync(password, 10);

  var user = new User({ email: email, name: name, password: hashedPassword });
  user.save()
    .then(function(savedUser) {
      res.status(201).json({ user: savedUser });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json({ message: "Unexpected Error Occured" });
    });
};

exports.login = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || email.trim() === "" || !password || password.length < 6) {
    res.status(422).json({ message: "Invalid Data" });
    return;
  }

  User.findOne({ email: email })
    .then(function(existingUser) {
      if (!existingUser) {
        res.status(404).json({ message: "No user found" });
      } else {
        var isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
          res.status(400).json({ message: "Incorrect Password" });
        } else {
          res.status(200).json({ id: existingUser._id, message: "Login Successful" });
        }
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json({ message: "Unexpected Error Occured" });
    });
};
