import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';
import { session } from 'telegraf';
import { ProductModule } from './product/product.module';
import { QuestionChatModule } from './question_chat/question_chat.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [session()],
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    AdminModule,
    CategoryModule,
    ProductModule,
    QuestionModule,
    QuestionChatModule
  ],
  providers: [AppService],
})
export class AppModule {}