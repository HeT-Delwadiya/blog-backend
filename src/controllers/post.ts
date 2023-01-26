import { CallbackError } from "mongoose";

const User = require("../models/User");
const Post  = require("../models/Post");
const Draft  = require("../models/Draft");


exports.getPostById = (req: any, res: any, next: Function, id:string) => {
       Post.findById(id)
              .populate("user","name email")
              .exec((err:CallbackError, post:any) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!post)
                     return res.status(400).json({Message:"Post not found!"})
              else {
                     req.post = post;
                     next();
              }
       });
}

exports.getPost = (req: any, res: any) => {
       return res.status(200).json(req.post);
}

exports.getTotalPages = (req: any, res: any) => {
       Post.count({}, (err:CallbackError, count: Number) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch posts from database!"});
              return res.status(200).json(count);
       })
}

exports.getPosts = async(req: any, res: any) => {
       //expect pageNumber and pageSize (posts/Page) from frontend
       Post.find({isApproved: true})
       .sort({ createdAt : -1})
       .populate("user", "name email")
       .skip((req.body.pageNumber-1)*req.body.pageSize)
       .limit(req.body.pageSize)
       .exec((err:CallbackError, posts:any) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch posts from database!"});
              return res.status(200).json(posts);
       })
}

exports.getPostsByName = (req: any, res: any) => {
       //expect pageNumber and pageSize (posts/Page) and post title from frontend
       let totalPosts: Number = 0;
       Post.count({postTitle: {'$regex': req.body.postTitle, $options:'i'} , isApproved: true})
       .exec((err:CallbackError, count:Number) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch posts from database!"});
              totalPosts = count;
       })
       Post.find({postTitle: {'$regex': req.body.postTitle, $options:'i'} , isApproved: true})
       .populate("user", "name email")
       .skip((req.body.pageNumber-1)*req.body.pageSize)
       .limit(req.body.pageSize)
       .exec((err:CallbackError, posts:any) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch posts from database!"});
              return res.status(200).json({totalPosts, posts});
       })
}

exports.createPost = async(req: any, res:any) => {
       if(req.body.postData=="" || req.body.postTitle=="" || req.body.user=="" || req.body.postShortDescription=="") {
              return res.status(400).json({error: "Please provide all required details!"})
       }
       const post = new Post({
              postTitle: req.body.postTitle,
              postData: req.body.postData,
              postShortDescription: req.body.postShortDescription,
              user: req.body.user,
              isApproved: false
       })

       const result = await post.save();

       User.findByIdAndUpdate(
              {_id: req.body.user},
              {$push: {posts: result._id}},
              {new: true},
              (err:CallbackError, user:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to add new post in user's database!"});
              })

       return res.status(200).json(result);
}

exports.updatePost = (req:any, res:any) => {
       if(req.body.postData=="" || req.body.postTitle=="" || req.body.postShortDescription=="") {
              return res.status(400).json({error: "Please provide all required details!"})
       }

       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$set: req.body},
              {new: true},
              (err:CallbackError, post:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to update post in database!"});
                     return res.status(200).json(post);
              })
}

exports.deletePost = (req:any, res:any) => {

       Post.findByIdAndDelete(
              req.post._id,
              (err:CallbackError, post:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to delete post from database!"});
                     User.findByIdAndUpdate(
                            {_id: post.user},
                            {$pull: {posts: req.post._id}},
                            {new: true},
                            (err:CallbackError, user:any) => {
                                   if(err)
                                          return res.status(500).json({error:"Failed to update user's post array in database!"});
                            })
              })

       return res.status(200).json({"Message":"Post deleted successfully"});
}

exports.addComment = (req:any, res:any) => {
       if(req.body.commentId=="" || req.body.commentUser=="" || req.body.commentText=="" || req.body.commentUserName=="") {
              return res.status(400).json({error: "Please provide all required details!"})
       }

       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$push: {comments: req.body}},
              {new: true},
              (err:CallbackError, post:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to add comment in database!"});
                     return res.status(200).json(post);
              })
}

exports.deleteComment = (req: any, res: any) => {
       if(req.body.commentId=="") {
              return res.status(400).json({error: "Please provide comment id!"})
       }

       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$pull: {comments: {commentId:req.body.commentId}}},
              {new: true},
              (err:CallbackError, post:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to delete comment from database!"});
                     return res.status(200).json(post);
              })
}