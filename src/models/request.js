const { Schema, model} = require("mongoose");

const requestSchema = new Schema({
   senderId: {
    type: Schema.Types.ObjectId,
    required: true
   },
   receiverId: {
    type: Schema.Types.ObjectId,
    required: true
   },
   status: {
      type: String,
      required: true,
      enum: {
         values: ["pass", "like", "accepted", "rejected"]},
         message: `{VALUE} is incorrect status type`
   }
}, {timestamps: true})

module.exports = model("Request", requestSchema);