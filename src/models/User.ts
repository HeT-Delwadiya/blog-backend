import mongoose from "mongoose";
import crypto from "crypto";
const {v1: uuidv1} = require("uuid");
const ObjectId = mongoose.Schema.Types.ObjectId;

let userSchema = new mongoose.Schema<any>({
       name: {
              type: String,
              required: true,
              maxlength: 32,
              trim:true
       },
       email: {
              type: String,
              trim: true,
              required: true,
              unique: true
       },
       posts: [{
              type: ObjectId,
              ref: "Post"
       }],
       drafts: [{
              type: ObjectId,
              ref: "Draft"
       }],
       role: {
              type: Number,
              default: 0
       },
       encry_password: {
              type: String,
              required: true
       },
       salt: String,
},{ timestamps: true });

userSchema
       .virtual("password")
       .set(function(password){
              this._password = password;
              this.salt = uuidv1();
              this.encry_password = this.securePassword(password);
       })
       .get(function(){
              return this._password;
       })

userSchema.methods = {

       authenticate: function(plainpassword: string) {
              return this.securePassword(plainpassword) === this.encry_password
       },

       securePassword: function(plainpassword: string) {
              if(!plainpassword) return "";
              try {
                     return crypto
                     .createHmac('sha256', this.salt)
                     .update(plainpassword)
                     .digest('hex');
              } catch(err) {
                     return "";
              } 
       }
};

var User : mongoose.Model<any> = mongoose.model("User", userSchema);
export = User; 