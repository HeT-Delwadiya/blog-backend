import express from "express";
const router = express.Router();
const { createPost, getPosts, getPost, getTotalPages, getPostsByName, updatePost, getPostById, deletePost, addComment, deleteComment } = require("../controllers/post");
const { getUserById } = require("../controllers/user");
const { isAuthenticated, isSignedIn } = require("../middlewares/auth");

router.param("userId", getUserById);
router.param("postId", getPostById);

//create
router.post("/user/:userId/post/create", isSignedIn, isAuthenticated, createPost);

//read
router.get("/post/:postId", getPost);
router.get("/posts/pages", getTotalPages);
router.post("/posts", getPosts);
router.post("/posts/by/name", getPostsByName);

//update
router.put("/user/:userId/post/:postId/update", isSignedIn, isAuthenticated, updatePost);
router.put("/user/:userId/post/:postId/comment/add", isSignedIn, isAuthenticated, addComment);
router.put("/user/:userId/post/:postId/comment/remove", isSignedIn, isAuthenticated, deleteComment);

//delete
router.delete("/user/:userId/post/:postId/delete", isSignedIn, isAuthenticated, deletePost);


module.exports = router;