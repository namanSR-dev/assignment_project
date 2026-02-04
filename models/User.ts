import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // clear extra spaces from name
    },
    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails pls
      lowercase: true, // force small letters for login
      index: true, // search go fast
    },
    password: {
      type: String,
      required: true,
      select: false, // hide from api, dont send to client!!
    },
  },
  { timestamps: true } // auto make create/update time
);

// if model exist use it, dont recreate or it crash on refresh
export const User = models.User || model("User", UserSchema);
