import { menus } from './../enums/menus.enum';
import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Context, Markup, session } from 'telegraf';
import { keyboards } from '../enums/keyboard.enums';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor( private readonly productService: ProductService,
    private readonly userService: UserService) {}
  start(ctx: Context) {
    const keyboard = Markup.keyboard([keyboards.addProduct]).resize();
    ctx.reply('Assalomu aleykum admin', keyboard);
  }

  addProduct(ctx: any) {
    ctx.session.menu = menus.addTitle;
    ctx.reply('Marhamat nomini kiriting: ');
  }

  async message(ctx: any) {
    
    const message = ctx.message.text;
    switch (ctx.session.menu) {

      case menus.addTitle:
        ctx.session.product = {
          name: message,
        };
        ctx.session.menu = menus.addDescription;
        ctx.reply('Marhamat izoh kiriting');
        return;

      case menus.addDescription:
        ctx.session.product.description = message;
        ctx.session.menu = menus.addPhoto;
        ctx.reply('Marhamat mahsulot rasmini yuboring');
        return;

      case menus.addPhoto:        
        if ( !ctx.message?.photo) {
          ctx.reply("Men sizdan rasm faylini kutayapman");
          return;
        }
        ctx.session.product.photo_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        ctx.session.menu = menus.addPrice;
        ctx.reply('Marhamat mahsulot narxini yuboring');
        return;

      case menus.addPrice:
        ctx.session.menu = null;
        ctx.session.product.price = message;
        console.log(ctx.session.product);
        ctx.reply('Muvaffaqiyatli qo\'shildi');
        
        const userId = await this.userService.getId(ctx.message.from.id + "");
        ctx.session.product.author_id = userId;

        await this.productService.create(ctx.session.product)
        
    }
  }
} 
