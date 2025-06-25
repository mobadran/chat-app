import mongoose, { Document, Schema, Model, PopulatedDoc } from 'mongoose';
import { IConversation } from './conversation.model.js';
import { IUser } from './user.model.js';

export interface IConversationMember extends Document {
  _id: mongoose.Types.ObjectId;
  userId: PopulatedDoc<IUser & Document>;
  conversationId: PopulatedDoc<IConversation & Document>;
  joinedAt: Date;
}

const ConversationMemberSchema: Schema = new Schema<IConversationMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'joinedAt', updatedAt: false },
  },
);

ConversationMemberSchema.index({ userId: 1, conversationId: 1 }, { unique: true });

const ConversationMember: Model<IConversationMember> = mongoose.model<IConversationMember>('ConversationMember', ConversationMemberSchema);

export default ConversationMember;
