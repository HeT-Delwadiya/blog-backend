import express from "express";
const router = express.Router();
const { getUserById } = require("../controllers/user");
const { getDraftById, createDraft, getDraft, getUserDrafts, updateDraft, deleteDraft, publishDraftToPost } = require("../controllers/draft");
const { isAuthenticated, isSignedIn } = require("../middlewares/auth");

router.param("userId", getUserById);
router.param("draftId", getDraftById);

//create
router.post("/user/:userId/draft/create", isSignedIn, isAuthenticated, createDraft);

//read
router.get("/user/:userId/draft/:draftId", isSignedIn, isAuthenticated, getDraft);
router.get("/user/:userId/drafts", isSignedIn, isAuthenticated, getUserDrafts);

//update
router.put("/user/:userId/draft/:draftId/update", isSignedIn, isAuthenticated, updateDraft);

//delete
router.delete("/user/:userId/draft/:draftId/delete", isSignedIn, isAuthenticated, deleteDraft);
router.post("/user/:userId/draft/:draftId/publish", isSignedIn, isAuthenticated, publishDraftToPost);


module.exports = router;