import Conversation, { IConversation } from '#models/conversation.model.js';
import ConversationMember from '#models/conversationMember.model.js';
import User, { IUser } from '#models/user.model.js';
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, CREATED, OK } from '#constants/http-status-codes.js';
import { Document } from 'mongoose';

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, name, members } = req.body;

    // Add the current user to the members list if they are not already included
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
      // If: type === 'direct', name = null
      // else if: type === 'group', name = name || null
      name: type === 'direct' ? null : name || null,
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

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await ConversationMember.find({ userId: req.user!.id }).select('conversationId').populate('conversationId');

    const filteredConversations = await Promise.all(
      conversations.map(async (c) => {
        const populatedConversation = c.conversationId as IConversation & Document;

        let name = populatedConversation.name;
        if (populatedConversation.name === null) {
          const users = await ConversationMember.find({ conversationId: populatedConversation._id, userId: { $ne: req.user!.id } }).populate(
            'userId',
            'username displayName',
          );

          name = users.map((u) => (u.userId as IUser).displayName).join(', ');
          console.log(name);
          console.log(users);
        }

        return {
          _id: populatedConversation._id,
          type: populatedConversation.type,
          name,
        };
      }),
    );

    res.status(OK).json(filteredConversations);
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    const conversationMembers = await ConversationMember.find({ conversationId: req.params.id }).populate('userId');
    res.status(OK).json({ conversation, conversationMembers });
  } catch (error) {
    next(error);
  }
};
