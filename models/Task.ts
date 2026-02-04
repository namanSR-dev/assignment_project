import { Schema, models, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // cut space from title
    },
    completed: {
      type: Boolean,
      default: false, // new task not finish yet
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // link this to User model
      required: true,
      index: true, // find user tasks fast
    },
  },
  { timestamps: true } // get dates for free
);

// fix for nextjs reload, check if exist first
export const Task = models.Task || model("Task", TaskSchema);
