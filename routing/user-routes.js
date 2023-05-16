var express = require("express");
var userControllers = require("../controllers/user-controllers");

var userRouter = express.Router();

userRouter.get("/", userControllers.getAllUsers);
userRouter.get("/:id", userControllers.getUserById);
userRouter.post("/signup", userControllers.signup);
userRouter.post("/login", userControllers.login);

module.exports = userRouter;
