import { Module } from '@nestjs/common';
import { QuestionChatService } from './question_chat.service';
import { QuestionChatController } from './question_chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuestionChat,
  QuestionChatSchema,
} from './schemas/question_chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionChat.name, schema: QuestionChatSchema },
    ]),
  ],
  controllers: [QuestionChatController],
  providers: [QuestionChatService],
  exports: [QuestionChatService],
})
export class QuestionChatModule {}
