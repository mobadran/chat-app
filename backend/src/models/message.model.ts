import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderInfo: {
    username: string;
    displayName: string;
  };
  content: string;
  type: 'text';
}

const MessageSchema: Schema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderInfo: {
      username: { type: String, required: true },
      displayName: { type: String, required: true },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['text'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  },
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
