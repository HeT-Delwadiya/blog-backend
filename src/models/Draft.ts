import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const draftSchema = new mongoose.Schema(
       {
              draftTitle: {
                     type: String,
                     required: true,
                     trim: true
              },
              draftData: {
                     type: String,
                     required: true,
                     trim: true
              },
              draftShortDescription: {
                     type: String,
                     required: true,
                     trim: true
              },
              user: {
                     type: ObjectId,
                     ref: "User"
              }
       },
       { timestamps: true }
);

var Draft : mongoose.Model<any> = mongoose.model("Draft", draftSchema);
export = Draft;