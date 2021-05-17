import { Schema } from "mongoose";
import { IUser } from "../interfaces/User";
import mongoose from "mongoose";

const user: Schema<IUser> = new Schema<IUser>({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    required: true,
  },
  photoId: {
    type: String,
    required: true,
  },
  chatId: {
    type: Number,
    required: true,
  },
  countPick: {
    type: Number,
    required: true,
  },
});

user.methods.pick = function (): Promise<IUser> {
  this.countPick++;

  return this.save();
};

user.methods.setValid = function (value: boolean): Promise<IUser> {
  this.isValid = value;

  return this.save();
};

user.methods.setPhoto = function (photoId: string): Promise<IUser> {
  this.photoId = photoId;

  return this.save();
};



export const User = mongoose.model<IUser>("User", user);
