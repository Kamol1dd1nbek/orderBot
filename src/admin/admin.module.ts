import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, ProductModule],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
