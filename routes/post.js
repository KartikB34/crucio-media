const express = require("express");
const { createPost, LikeAndUnlikePost, deletePost, getPostOfFollowing, updateCaption, commentOnPost, deleteComment } = require("../controller/post");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

//If logged-in (isAuthenticated) then only user can post (Files in middleware folder)
router.route("/post/upload").post(isAuthenticated,createPost)         //first isAuthenticated will run then createPost will        

router.route("/post/:id")
    .get(isAuthenticated, LikeAndUnlikePost)
    .put(isAuthenticated, updateCaption)
    .delete(isAuthenticated, deletePost)

router.route("/posts").get(isAuthenticated, getPostOfFollowing)
router.route("/post/comment/:id")
    .put(isAuthenticated, commentOnPost)
    .delete(isAuthenticated, deleteComment)

module.exports = router;