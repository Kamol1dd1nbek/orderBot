import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
  ],
  controllers: [],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
