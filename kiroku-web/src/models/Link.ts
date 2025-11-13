import mongoose from 'mongoose';

export interface ILink {
  _id?: string;
  url: string;
  title?: string;
  description?: string;
  domain: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isFavorite?: boolean;
}

const LinkSchema = new mongoose.Schema<ILink>({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  domain: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  tags: [{
    type: String,
  }],
  isFavorite: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

LinkSchema.index({ userId: 1, url: 1 }, { unique: true });
LinkSchema.index({ userId: 1, createdAt: -1 });
LinkSchema.index({ userId: 1, domain: 1 });

export default mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);