import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema(
       {
              postTitle: {
                     type: String,
                     required: true,
                     trim: true
              },
              postShortDescription: {
                     type: String,
                     required: true,
                     trim: true
              },
              postData: {
                     type: String,
                     required: true,
                     trim: true
              },
              user: {
                     type: ObjectId,
                     ref: "User"
              },
              isApproved: {
                     type: Boolean,
                     default: false
              },
              comments: [{}]
       },
       { timestamps: true }
);

var Post : mongoose.Model<any> = mongoose.model("Post", postSchema);
export = Post;