import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderInfo: {
    username: string;
    displayName: string;
  };
  content: string;
  clientMessageId?: string;
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
      displayName: { type: String },
      avatar: { type: String },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    clientMessageId: { type: String },
  },
  {
    timestamps: true,
  },
);

MessageSchema.index({ conversationId: 1 });
MessageSchema.index(
  { conversationId: 1, senderId: 1, clientMessageId: 1 },
  { unique: true, partialFilterExpression: { clientMessageId: { $type: 'string' } } },
);

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
