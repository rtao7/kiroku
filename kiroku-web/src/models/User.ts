import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  name?: string;
  image?: string;
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

UserSchema.index({ email: 1 });
UserSchema.index({ apiKey: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);