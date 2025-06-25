// src/models/ConversationMember.ts

// 1. IMPORT PopulatedDoc from 'mongoose'
// 2. IMPORT the IConversation interface from your Conversation model file
import mongoose, { Document, Schema, Model, PopulatedDoc } from 'mongoose';
import { IConversation } from './conversation.model.js'; // Adjust path if necessary

export interface IConversationMember extends Document {
  _id: mongoose.Types.ObjectId; // MongoDB _id type
  userId: mongoose.Types.ObjectId; // User ObjectId
  // THIS IS THE LINE YOU NEED TO CHANGE:
  // It tells TypeScript that 'conversationId' can either be an ObjectId
  // OR a fully populated IConversation document (including Mongoose Document properties).
  conversationId: PopulatedDoc<IConversation & Document>; // <--- THIS IS THE SOLUTION
  joinedAt: Date; // From timestamps
  createdAt: Date; // Mongoose Document property
  updatedAt: Date; // Mongoose Document property (if timestamps is enabled for this field)
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
    timestamps: { createdAt: 'joinedAt', updatedAt: false }, // Use 'joinedAt' for creation time, disable 'updatedAt'
  },
);

ConversationMemberSchema.index({ userId: 1, conversationId: 1 }, { unique: true });

const ConversationMember: Model<IConversationMember> = mongoose.model<IConversationMember>('ConversationMember', ConversationMemberSchema);

export default ConversationMember;
