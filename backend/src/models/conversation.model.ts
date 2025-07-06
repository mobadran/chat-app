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

ConversationSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await mongoose.model('ConversationMember').deleteMany({ conversationId: this._id });
  next();
});

const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
