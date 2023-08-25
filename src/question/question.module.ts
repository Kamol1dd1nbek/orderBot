import { Module, forwardRef } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { QuestionChatModule } from '../question_chat/question_chat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Question.name,
      schema: QuestionSchema
    }]),
    forwardRef(() => QuestionChatModule)
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule {}
