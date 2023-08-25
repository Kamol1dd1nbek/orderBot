import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionChat } from './schemas/question_chat.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class QuestionChatService {
  constructor(@InjectModel(QuestionChat.name) private readonly questionChatService: Model<QuestionChat>) {}

  async create(userId: string) {
    const isHaveChat = await this.questionChatService.findOne({ user_id: userId });
    if ( isHaveChat ) {
      return isHaveChat._id;
    }
    const newChat = await this.questionChatService.create({ not_answered: 0, user_id: userId });
    return newChat._id;
  }

  async addMessage(user_id: string, message_id: Types.ObjectId) {
    const chat = await this.questionChatService.findOne({ user_id });
    if (!chat) {
      const chat_id = await this.create(user_id);
      const chat = await this.questionChatService.findOne({ _id: chat_id });
      chat.messages.push(message_id);
      chat.save();
    }
    chat.messages.push(message_id);
    if (user_id !== process.env.ADMIN_ID_1) {
      chat.not_answered += 1;
    } else {
      chat.not_answered = 0;
    }
    chat.save();
  }
}
