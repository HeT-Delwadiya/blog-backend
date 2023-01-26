import Draft from "../models/Draft";
import User from "../models/User";
import Post from "../models/Post";
import { CallbackError } from "mongoose";

exports.getDraftById = (req: any, res: any, next: Function, id: string) => {
       Draft.findById(id)
              .populate("user","name email")
              .exec((err: CallbackError, draft: any) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!draft)
                     return res.status(400).json({Message:"Draft not found!"})
              else {
                     req.draft = draft;
                     next();
              }
       });
}

exports.getDraft = (req: any, res: any) => {
       return res.status(200).json(req.draft);
}

exports.getUserDrafts = (req: any, res: any) => {
       Draft.find({user:req.profile._id})
       .exec((err: CallbackError, drafts: any) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(drafts.length<1)
                     return res.status(400).json({Message:"No drafts found!"})
              else {
                    return res.status(200).json(drafts);
              }
       })
}

exports.createDraft = async(req: any, res: any) => {
       if(req.body.draftData=="" || req.body.draftTitle=="" || req.body.draftShortDescription=="" || req.body.user=="") {
              return res.status(400).json({error: "Please provide all required details!"})
       }

       const draft = new Draft({
              draftTitle: req.body.draftTitle,
              draftData: req.body.draftData,
              draftShortDescription: req.body.draftShortDescription,
              user: req.body.user
       })

       const result = await draft.save();

       User.findByIdAndUpdate(
              {_id: req.body.user},
              {$push: {drafts: result._id}},
              {new: true},
              (err:CallbackError, user:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to add new draft in user's database!"});
              })

       return res.status(200).json(result);
}

exports.updateDraft = (req: any, res: any) => {
       if(req.body.draftData=="" || req.body.draftTitle=="" || req.body.draftShortDescription=="") {
              return res.status(400).json({error: "Please provide all required details!"})
       }

       Draft.findByIdAndUpdate(
              {_id: req.draft._id},
              {$set: req.body},
              {new: true},
              (err:CallbackError, draft:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to update draft in database!"});
                     return res.status(200).json(draft);
              })
}

exports.deleteDraft = (req: any, res: any) => {

       Draft.findByIdAndDelete(
              req.draft._id,
              (err:CallbackError, draft:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to delete draft from database!"});
                     User.findByIdAndUpdate(
                            {_id: draft.user},
                            {$pull: {drafts: req.draft._id}},
                            {new: true},
                            (err:CallbackError, user:any) => {
                                   if(err)
                                          return res.status(500).json({error:"Failed to update user's draft array in database!"});
                            })
              })

       return res.status(200).json({"Message":"Draft deleted successfully"});
}

exports.publishDraftToPost = async(req: any, res: any) => {
       const post = new Post({
              postTitle: req.body.fromInputs ? req.body.postTitle : req.draft.draftTitle,
              postData: req.body.fromInputs ? req.body.postData : req.draft.draftData,
              postShortDescription: req.body.fromInputs ? req.body.postShortDescription : req.draft.draftShortDescription,
              user: req.draft.user,
              isApproved: false
       })
       let error=null;

       const postInDB = await post.save();

       Draft.findByIdAndDelete(
              req.draft._id,
              (err:CallbackError, draft:any) => {
                     if(err)
                            error=err;
                     User.findByIdAndUpdate(
                            {_id: draft.user},
                            {$pull: {drafts: req.draft._id}},
                            {new: true},
                            (err:CallbackError, user:any) => {
                                   if(err)
                                          error=err;
                            })

                     User.findByIdAndUpdate(
                            {_id: draft.user},
                            {$push: {posts: postInDB._id}},
                            {new: true},
                            (err:CallbackError, user:any) => {
                                   if(err)
                                          error=err;
                            })
              })

       if(error!==null)
              return res.status(500).json(error);

       return res.status(200).json({"Message":"Draft published successfully. Your post will be available once admin approves it."});
}

