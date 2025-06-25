import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IConversationMember extends Document {
  userId: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
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
