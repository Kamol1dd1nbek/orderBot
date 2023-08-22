import { languages } from './../enums/keyboard.enums';

import { menus } from './../enums/menus.enum';
import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Context, Markup, session } from 'telegraf';
import { addProduct_lan, admin_asistants, keyboards, main } from '../enums/keyboard.enums';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { deletter } from '../helpers/messageDeletter.helper';
import { productMaker } from '../helpers/productMaker.helper';

@Injectable()
export class AdminService {
  constructor( private readonly productService: ProductService,
    private readonly userService: UserService) {}
  start(ctx: any) {
    const keyboard = Markup.keyboard([[main.home, main.search, main.add, main.question, main.hamburger]]).resize();
    ctx.reply(admin_asistants.salomWithAdmin[ctx.session.language], keyboard);
    deletter(ctx);
  }

  addProduct(ctx: any) {
    ctx.session.menu = menus.addTitle;
    ctx.reply(addProduct_lan.name[ctx.session.language]);
    deletter(ctx);
  }

  async message(ctx: any) {
    const message = ctx.message.text;

    switch (ctx.session.menu) {
      case menus.addTitle:
        ctx.session.product = {
          name: message,
        };
        ctx.session.menu = menus.addDescription;
        ctx.reply(addProduct_lan.description[ctx.session.language]);
        return;

      case menus.addDescription:
        ctx.session.product.description = message;
        ctx.session.menu = menus.addPhoto;
        ctx.reply(addProduct_lan.photo[0][ctx.session.language]);
        return;
 
      case menus.addPhoto:        
        if ( !ctx.message?.photo) {
          ctx.reply(addProduct_lan.photo[1][ctx.session.language]);
          return;
        }
        ctx.session.product.photo_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        ctx.session.menu = menus.addPrice;
        ctx.reply(addProduct_lan.price[ctx.session.language]);
        return;

      case menus.addPrice:
        ctx.session.menu = null;
        ctx.session.product.price = message;
        ctx.reply(addProduct_lan.ok[ctx.session.language]);
        
        const user = await this.userService.findOne(ctx.message.from.id + "");
        ctx.session.product.author = user;
        console.log(ctx.session.product.author);
        

        const addedProduct = await this.productService.create(ctx.session.product);
        const data = {
          ...ctx.session.product,
          ...ctx.session.product.author
        }
        productMaker(ctx, data, 0);
    }
  }
} 
