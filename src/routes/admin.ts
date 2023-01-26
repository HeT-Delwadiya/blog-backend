import express from "express";
const router = express.Router();
const { getUsers, getUser, getTotalUserPages, getNonApprovedPosts, getTotalApprovedPostPages, getTotalNonApprovedPostPages, getApprovedPosts, approvePost, removeUser, removePost } = require("../controllers/admin");
const { getUserById } = require("../controllers/user");
const { getPostById } = require("../controllers/post");
const { isAuthenticated, isSignedIn, isAdmin } = require("../middlewares/auth");

router.param("adminId", getUserById);
router.param("postId", getPostById);

//read
router.get("/admin/:adminId/users/pages", isSignedIn, isAdmin, getTotalUserPages);
router.post("/admin/:adminId/users", isSignedIn, isAuthenticated, isAdmin, getUsers);
router.get("/admin/:adminId/users/:userId", isSignedIn, isAdmin, getUser);
router.get("/admin/:adminId/posts/approval/pending/pages", isSignedIn, isAuthenticated, isAdmin, getTotalNonApprovedPostPages);
router.post("/admin/:adminId/posts/approval/pending", isSignedIn, isAuthenticated, isAdmin, getNonApprovedPosts);
router.get("/admin/:adminId/posts/approved/pages", isSignedIn, isAuthenticated, isAdmin, getTotalApprovedPostPages);
router.post("/admin/:adminId/posts/approved", isSignedIn, isAuthenticated, isAdmin, getApprovedPosts);

//update
router.put("/admin/:adminId/post/:postId/approve", isSignedIn, isAuthenticated, isAdmin, approvePost);

//delete
router.delete("/admin/:adminId/user/:userId/delete", isSignedIn, isAuthenticated,  isAdmin, removeUser);
router.delete("/admin/:adminId/post/:postId/delete", isSignedIn, isAuthenticated, isAdmin, removePost);

module.exports = router;