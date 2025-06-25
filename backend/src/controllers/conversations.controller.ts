import Conversation from '#models/conversation.model.js';
import ConversationMember from '#models/conversationMember.model.js';
import User from '#models/user.model.js';
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, CREATED } from '#constants/http-status-codes.js';

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, name, members } = req.body;

    if (!members.includes(req.user!.username)) {
      members.push(req.user!.username);
    }

    if (type === 'direct' && members.length !== 2) {
      res.status(BAD_REQUEST).json({ message: 'Direct conversation must have exactly two members' });
      return;
    }

    if (type === 'group' && members.length < 3) {
      res.status(BAD_REQUEST).json({ message: 'Group conversation must have at least three members' });
      return;
    }

    const foundUsers = await User.find({ username: { $in: members } });

    if (foundUsers.length !== members.length) {
      const foundUsernames = new Set(foundUsers.map((u) => u.username));
      const notFoundMembers = members.filter((member: string) => !foundUsernames.has(member));
      res.status(BAD_REQUEST).json({ message: `One or more users not found: ${notFoundMembers.join(', ')}` });
      return;
    }

    const conversation = await Conversation.create({
      type,
      name: name || null,
    });

    const conversationMembers = foundUsers.map((user) => ({
      conversationId: conversation._id,
      userId: user._id,
    }));

    await ConversationMember.insertMany(conversationMembers);

    res.status(CREATED).json({ message: 'Conversation created successfully' });
  } catch (error) {
    next(error);
  }
};
