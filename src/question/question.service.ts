import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { Model } from 'mongoose';
import { QuestionChatService } from '../question_chat/question_chat.service';

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private readonly questionService: Model<Question>,
  private readonly questionChatService: QuestionChatService) {}
  
  async create(createQuestionDto: CreateQuestionDto) {
    const chat_id = await this.questionChatService.create(createQuestionDto.tg_id);
    const newMessage = await this.questionService.create({
      ...createQuestionDto,
      question_chat_id: chat_id
    });
    await this.questionChatService.addMessage(createQuestionDto.tg_id, newMessage._id);
    console.log(1);
    return 1;
  }

  async findAll(userId: string) {
    const adminId = process.env.ADMIN_ID_1 + '';
    // const messages = awai
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} question`;
  // }

  // update(id: number, updateQuestionDto: UpdateQuestionDto) {
  //   return `This action updates a #${id} question`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} question`;
  // }
}
