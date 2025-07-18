import { NextFunction, Request, Response } from 'express';
import ConversationMember from '#models/conversationMember.model.js';
import Message from '#models/message.model.js';
import { CREATED, FORBIDDEN, OK } from '#constants/http-status-codes.js';
import { Document } from 'mongoose';
import { IUser } from '#models/user.model.js';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { conversationId } = req.params;
    const username = req.user!.username;

    const memberRecord = await ConversationMember.findOne({ conversationId, userId: req.user!.id }).populate('userId', 'username displayName avatar');
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
        avatar: userId.avatar,
      },
      content,
    });

    res.status(CREATED).json({ message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user!.id;

    const memberRecord = await ConversationMember.findOne({ conversationId, userId }).populate('userId', 'username displayName');
    if (!memberRecord) {
      res.status(FORBIDDEN).json({ message: 'You are not authorized to view messages for this conversation, or the conversation/user does not exist.' });
      return;
    }

    const messages = await Message.find({ conversationId });
    res.status(OK).json(messages);
  } catch (error) {
    next(error);
  }
};
