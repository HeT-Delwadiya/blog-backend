const User = require("../models/User");
const { validationResult, Result } = require('express-validator');
import jwt from 'jsonwebtoken';
import { CallbackError } from 'mongoose';

exports.register = (req: any, res: any) => {

       const errors = validationResult(req);

       if(!errors.isEmpty()) {
              return res.status(400).json({error: errors.array()[0].msg});
       }

       const newUser = new User(req.body);
       newUser.save((err:CallbackError, user:any) => {
              if(err)
                     return res.status(400).json({"Message":"Email already registered with another account!"});
              else {
                     const authtoken = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET);
                     res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
                            
                     const {_id, name, email} = user;
                     return res.status(200).json({authtoken, user: {_id, name, email}});
              }
       });
       
}

exports.login = (req: any, res: any) => {

       const errors = validationResult(req);
       const {email, password} = req.body;

       if(!errors.isEmpty()) {
              return res.status(400).json({error: errors.array()[0].msg});
       }

       User.findOne({email}, (err:CallbackError, user:any) => {
              if(err)
                     return res.status(500).json({"Error":err});
              else if(!user) 
                     return res.status(400).json({"Message":"User with this email not found!"});
              else {
                     if(!user.authenticate(password)) {
                            return res.status(400).json({"Message":"Email and password does not match!"})
                     }
                     
                     const authtoken = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET);
                     res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
                            
                     const {_id, name, email} = user;
                     return res.status(200).json({authtoken, user: {_id, name, email}});
              }
       })
}

exports.logout = (req: any, res: any) => {
       res.clearCookie("token");
       res.json({
              message: "User signed out successfully"
       });
}