import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionChat } from './schemas/question_chat.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionChatService {
  constructor(
    @InjectModel(QuestionChat.name)
    private readonly questionChatService: Model<QuestionChat>,
  ) {}

  async create(userId: string) {
    const isHaveChat = await this.questionChatService.findOne({
      user_id: userId,
    });
    if (isHaveChat) {
      return isHaveChat;
    }
    const newChat = await this.questionChatService.create({
      not_answered: 0,
      user_id: userId,
    });
    return newChat;
  }
  async addMessage(user_id: string, message: string, isAdmin: boolean = false) {
    let chat;
    chat = await this.questionChatService.findOne({ user_id });
    if (!chat) {
      chat = await this.create(user_id);
    }
    let is_admin;
    if (isAdmin) is_admin = true;
    else is_admin = false;
    const newMessage = {
      user_id: user_id,
      message,
      isAdmin: is_admin,
    };
    chat.messages.push(newMessage);
    if (!isAdmin) {
      chat.not_answered += 1;
    } else {
      chat.not_answered = 0;
    }
    await chat.save();
  }

  async findChat(user_id: string) {
    const chat = await this.questionChatService.findOne({ user_id }).exec();
    if (!chat) {
      return this.create(user_id);
    }
    else return chat;
  }
}
