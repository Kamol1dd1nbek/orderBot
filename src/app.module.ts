import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
