import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';
import { session } from 'telegraf';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      middlewares: [session()]
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema }
    ]),
    UserModule,
    AdminModule,
    CategoryModule,
    ProductModule
  ],
  providers: [AppService],
})
export class AppModule {}
