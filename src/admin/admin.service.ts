import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Context, Markup } from 'telegraf';
import { keyboards } from '../enums/keyboard.enums';

@Injectable()
export class AdminService {

  start(ctx: Context) {
    const keyboard = Markup.keyboard([keyboards.addProduct]).resize();
    ctx.reply("Assalomu aleykum admin", keyboard)
  }

  addProduct( ){
    
  }
}
