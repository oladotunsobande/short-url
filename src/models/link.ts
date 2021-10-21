import { Schema, Document } from 'mongoose';

export interface ILink extends Document {
  token: string;
  longURL: string;
  isActive: boolean;
  validityDays: number;
  expiredAt?: Date;
}

export const LinkSchema = new Schema(
  {
    token: { 
      type: String, 
      unique: true,
      required: true,
      trim: true,
    },
    longURL: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    isActive: { type: Boolean, default: true },
    validityDays: { type: Number, required: true },
    expiredAt: { type: Date }
  },
  { timestamps: true },
);

LinkSchema.index(
  { token: 1, longURL: 1 },
  { unique: true },
);