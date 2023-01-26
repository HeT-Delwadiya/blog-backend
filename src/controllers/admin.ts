import { CallbackError } from "mongoose";
import Post from "../models/Post";
import User from "../models/User";

exports.getAdminById = (req:any, res:any, next: Function, id:string) => {
       User.findById(id)
              .populate("posts","postTitle postData isApproved comments postShortDescription")
              .populate("drafts","postTitle postData draftShortDescription")
              .exec((err:CallbackError, user:any) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!user)
                     return res.json({Message:"User not found!"})
              else {
                     user.encry_password = undefined;
                     user.salt = undefined;
                     user.createdAt = undefined;
                     user.updatedAt = undefined;
                     req.profile = user;
                     next();
              }
       });
}

exports.getUsers = async(req: any, res: any) => {
       //expect pageNumber and pageSize (users/Page) from frontend
       const users = await User.find({role: 0})
       .sort({ createdAt : -1})
       .skip((req.body.pageNumber-1)*req.body.pageSize)
       .limit(req.body.pageSize);

       if(users.length>0)
              return res.status(200).json(users);
       return res.status(200).json({"Message":"No users found!"})
}

exports.getUser = (req:any, res:any) => {
       User.findById(req.params.userId)
              .populate("posts","postTitle postData isApproved comments postShortDescription")
              .populate("drafts","draftTitle draftData draftShortDescription")
              .exec((err:CallbackError, user:any) => {
              if(err)
                     return res.status(400).json({error:err})
              else if(!user)
                     return res.json({Message:"User not found!"})
              else {
                     return res.json(user);
              }
       });
}

exports.getTotalUserPages = (req: any, res: any) => {
       User.count({role: 0}, (err:CallbackError, count: Number) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch users from database!"});
              return res.status(200).json(count);
       })
}

exports.getNonApprovedPosts = (req: any, res: any) => {
       //expect pageNumber and pageSize (posts/Page) from frontend
       Post.find({isApproved: false})
       .sort({ createdAt : -1})
       .populate("user", "name email")
       .skip((req.body.pageNumber-1)*req.body.pageSize)
       .limit(req.body.pageSize)
       .exec((err:CallbackError, posts:any) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch post from database!"});
              return res.status(200).json(posts);
       })
}

exports.getTotalNonApprovedPostPages = (req: any, res: any) => {
       Post.count({isApproved: false}, (err:CallbackError, count: Number) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch posts from database!"});
              return res.status(200).json(count);
       })
}

exports.getTotalApprovedPostPages = (req: any, res: any) => {
       Post.count({isApproved: true}, (err:CallbackError, count: Number) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch posts from database!"});
              return res.status(200).json(count);
       })
}

exports.getApprovedPosts = (req: any, res: any) => {
       //expect pageNumber and pageSize (posts/Page) from frontend
       Post.find({isApproved: true})
       .sort({ createdAt : -1})
       .populate("user", "name email")
       .skip((req.body.pageNumber-1)*req.body.pageSize)
       .limit(req.body.pageSize)
       .exec((err:CallbackError, posts:any) => {
              if(err)
                     return res.status(500).json({error:"Failed to fetch post from database!"});
              return res.status(200).json(posts);
       })
}

exports.approvePost = (req: any, res: any) => {
       Post.findByIdAndUpdate(
              {_id: req.post._id},
              {$set: {isApproved: true}},
              {new: true},
              (err:CallbackError, post:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to update post in database!"});

                     return res.status(200).json(post);
              })
}

exports.removeUser = (req: any, res: any) => {
       User.findByIdAndDelete(
              req.params.userId,
              (err:CallbackError, user:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to delete user from database!"});
                     Post.deleteMany({user: user._id})
                     .exec((err:CallbackError, posts:any) => {
                            if(err)
                                   return res.status(500).json({error:"Failed to delete posts of user from database!"});
                     })
              })

       return res.status(200).json({"Message":"User deleted successfully with all user's data"});
}

exports.removePost = (req: any, res: any) => {
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