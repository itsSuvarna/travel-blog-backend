var express = require("express");
var postController = require("../controllers/post-controller");

var postRouter = express.Router();

postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id", postController.getPostById);
postRouter.post("/", postController.addPost);
postRouter.put("/:id", postController.updatePost);
postRouter.delete("/:id", postController.deletePost);

module.exports = postRouter;
