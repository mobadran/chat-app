import { NextFunction, Request, Response } from 'express';
import ConversationMember from '#models/conversationMember.model.js';
import Message from '#models/message.model.js';
import { CREATED, FORBIDDEN } from '#constants/http-status-codes.js';
import { Document } from 'mongoose';
import { IUser } from '#models/user.model.js';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { conversationId } = req.params;
    const username = req.user!.username;

    const memberRecord = await ConversationMember.findOne({ conversationId, userId: req.user!.id }).populate('userId', 'username displayName');
    if (!memberRecord) {
      res.status(FORBIDDEN).json({ message: 'You are not authorized to send messages to this conversation, or the conversation/user does not exist.' });
      return;
    }

    const userId = memberRecord.userId as IUser & Document;

    await Message.create({
      conversationId,
      senderId: userId._id,
      senderInfo: {
        username,
        displayName: userId.displayName || username,
      },
      content,
    });

    res.status(CREATED).json({ message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};
