import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionChatService } from './question_chat.service';

@Controller('question-chat')
export class QuestionChatController {
  constructor(private readonly questionChatService: QuestionChatService) {}

  // @Post()
  // create(@Body() createQuestionChatDto: CreateQuestionChatDto) {
  //   return this.questionChatService.create(createQuestionChatDto);
  // }

  // @Get()
  // findAll() {
  //   return this.questionChatService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.questionChatService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateQuestionChatDto: UpdateQuestionChatDto) {
  //   return this.questionChatService.update(+id, updateQuestionChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.questionChatService.remove(+id);
  // }
}
