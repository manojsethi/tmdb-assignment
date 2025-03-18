import mongoose from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  _id: mongoose.ObjectId;
}
