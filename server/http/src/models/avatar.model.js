import mongoose, { Schema } from "mongoose";

const avatarSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Avatar = mongoose.model("Avatar", avatarSchema);
