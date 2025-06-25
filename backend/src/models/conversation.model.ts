import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IConversation extends Document {
  type: 'direct' | 'group';
  name?: string;
}

const ConversationSchema: Schema = new Schema<IConversation>(
  {
    type: {
      type: String,
      required: true,
      enum: ['direct', 'group'],
    },
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
