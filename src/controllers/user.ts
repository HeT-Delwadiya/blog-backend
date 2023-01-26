import { CallbackError } from "mongoose";
import User from "../models/User";
import crypto from "crypto";
const {v1: uuidv1} = require("uuid");

exports.getUserById = (req:any, res:any, next: Function, id:string) => {
       User.findById(id)
              .populate("posts","postTitle postData isApproved comments postShortDescription")
              .populate("drafts","draftTitle draftData draftShortDescription")
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

exports.getUser = (req:any, res:any) => {
       return res.json(req.profile);
}

exports.updateUser = (req:any, res:any) => {
       let data: any;
       if(req.body.password) {
              data = {
                     name: req.body.name,
                     email: req.body.email,
                     salt: uuidv1(),
                     encry_password: req.body.password,
              }

              data.encry_password = crypto
                     .createHmac('sha256', data.salt)
                     .update(req.body.password)
                     .digest('hex');

       } else {
              data = {
                     name: req.body.name,
                     email: req.body.email
              }
       }

       User.findByIdAndUpdate(
              {_id: req.profile._id},
              {$set: data},
              {new: true},
              (err:CallbackError, user:any) => {
                     if(err)
                            return res.status(500).json({error:"Failed to update user in database!"});
                     user.encry_password = undefined;
                     user.salt = undefined;
                     user.createdAt = undefined;
                     user.updatedAt = undefined;
                     return res.status(200).json(user);
              })
}

exports.deleteUser = (req:any, res:any) => {
       User.findByIdAndDelete(req.profile._id)
       .exec((err: CallbackError, user:any) => {
              if(err)
                     return res.status(500).json({error:"Failed to delete user from database!"});
              return res.status(200).json({"Message": "User data deleted successfully from database!"})
       })
}