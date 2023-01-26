import express from "express";
const router = express.Router();
const { getUserById, getUser, updateUser, deleteUser } = require("../controllers/user");
const { isAuthenticated, isSignedIn } = require("../middlewares/auth");

router.param("userId", getUserById);

//read
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//update
router.put("/user/:userId/update", isSignedIn, isAuthenticated, updateUser);

//delete
router.delete("/user/:userId/delete", isSignedIn, isAuthenticated, deleteUser);

module.exports = router;