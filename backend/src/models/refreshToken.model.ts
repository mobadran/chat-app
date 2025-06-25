import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  _id: string;
  userId: mongoose.Schema.Types.ObjectId;
  deviceId: string;
  token: string;
  invalidatedAt: Date | null;
  createdAt: Date;
}

const RefreshTokenSchema: Schema = new Schema<IRefreshToken>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    invalidatedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

RefreshTokenSchema.index({ invalidatedAt: 1 });
RefreshTokenSchema.index({ createdAt: 1 });

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
