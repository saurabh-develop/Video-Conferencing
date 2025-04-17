import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    nationality: {
      type: {
        enum: ["India", "USA", "Australia"],
      },
      required: true,
    },
    avatarId: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      r,
    },
    role: {
      type: {
        enum: ["admin", "user"],
      },
      required: true,
    },
  },
  { timestamps: true }
);
