import { InjectModel } from '@nestjs/mongoose';
import {
  addProduct_lan,
  asistants,
  keyboards,
  languages,
  main,
} from './enums/keyboard.enums';
import { Update, Start, Ctx, Hears, On } from 'nestjs-telegraf';
import { Context, Markup, session } from 'telegraf';
import { Model } from 'mongoose';
import { getDistance } from './utils/get-distance.util';
import { isAdmin } from './utils/is-admin.util';
import { AdminService } from './admin/admin.service';
import { UserService } from './user/user.service';
import errorHandler from './decorators/errorHandler.decorator';
import { actions, menus } from './enums/menus.enum';
import { deletter } from './helpers/messageDeletter.helper';
import { user_pages } from './enums/menus.enum';
import {
  addToKesh,
  clearKesh,
  mainBtnMaker,
  messageMaker,
  productMaker,
} from './helpers';
import { QuestionChatService } from './question_chat/question_chat.service';
import { ProductService } from './product/product.service';
@errorHandler
@Update()
export class AppService {
  public lan;
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly questionChatService: QuestionChatService,
    private readonly productService: ProductService,
  ) {}

  //START
  @Start()
  async start(@Ctx() ctx: any) {
    clearKesh(ctx);
    ctx.session.kesh = [];
    ctx.session.menu = null;

    // await ctx.telegram.pinChatMessage(ctx.chat.id, ctx.message.message_id);
    const salomlashish = `
🇺🇿 Assalomu aleykum, Men Insonlar o'rtasida mahsulotlarni oson sotish va sotib olishga yordamlashuvchi botman!
Iltimos tilni tanlang:

🇺🇸 Hello, I'm a bot that helps people buy and sell products easily!
Please select a language:
 
🇷🇺 Привет, я бот, который помогает людям легко покупать и продавать товары!
Выберите язык:
    `;
    const languagesButton = Markup.keyboard([
      languages.uz,
      languages.en,
      languages.ru,
    ]).resize();

    addToKesh(ctx, ctx.message.message_id);

    const message = await ctx.reply(salomlashish, languagesButton);

    addToKesh(ctx, message.message_id);
    ctx.session.action = actions.set_language;
  }

  async authorization(ctx: any) {
    const id = ctx.update.message.from.id + '';
    const mainButtons = await mainBtnMaker(1);
    if (ctx.session.user) {
      const m_id = await ctx.reply(
        asistants.welcome[ctx.session.language],
        mainButtons,
      );
      clearKesh(ctx);
      addToKesh(ctx, m_id.message_id);
    } else {
      const user = await this.userService.findOne(id);
      if (user) {
        ctx.session.user = user;
        const m_id = await ctx.reply(
          asistants.welcome[ctx.session.language],
          mainButtons,
        );
        clearKesh(ctx);
        addToKesh(ctx, m_id.message_id);
      } else {
        ctx.session.action = actions.register;
        const keyboard = Markup.keyboard([
          keyboards.register[ctx.session.language],
        ])
          .resize()
          .oneTime();

        const m_id = await ctx.reply(
          asistants.welcome[ctx.session.language],
          keyboard,
        );
        clearKesh(ctx);
        addToKesh(ctx, m_id.message_id);
        return;
      }
    }
  }

  //REGISTER
  @Hears(keyboards.register)
  async register(@Ctx() ctx: any) {
    addToKesh(ctx, ctx.message.message_id);
    const keyboard = Markup.keyboard([
      Markup.button.contactRequest(keyboards.contact[ctx.session.language]),
    ])
      .resize()
      .oneTime();
    ctx.session.action = actions.sendContact;
    const msg = await ctx.reply(
      asistants.toPhoneNumber[ctx.session.language],
      keyboard,
    );
    addToKesh(ctx, msg.message_id);
  }

  //ON CONTACT
  @On('contact')
  async contact(@Ctx() ctx: any) {
    addToKesh(ctx, ctx.message.message_id);
    const phoneNumber = ctx.update.message.contact.phone_number;
    const user = ctx.update.message.from;

    const newUser = await this.userService.create({
      tg_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: phoneNumber,
      is_bot: user.is_bot,
      phone: phoneNumber,
      username: user.username,
      language_code: ctx.session.language,
    });

    const mainButtons = Markup.keyboard([
      [
        main.home[1],
        main.search[0],
        main.add[0],
        main.question[0],
        main.cart[0],
      ],
    ]).resize();

    if (isAdmin(user.id)) {
      return this.adminService.start(ctx);
    }
    const msg = await ctx.reply(
      asistants.tabrikForLogin[ctx.session.language],
      mainButtons,
    );
    clearKesh(ctx);
    addToKesh(ctx, msg.message_id);

    ctx.session.action = actions.free;
    ctx.session.user = newUser;
  }

  //   //ON LOCATION
  // @On('location')
  // async location(@Ctx() ctx: any) {
  //   try {
  //     const location = ctx.update.message.location;

  //     const nearestBranch = branches.reduce(
  //       (acc: any, branch: any, index: number) => {
  //         const distance = getDistance(
  //           branch.latitude,
  //           location.latitude,
  //           branch.longitude,
  //           location.longitude,
  //         );

  //         if (!acc) {
  //           return {
  //             branchIndex: index,
  //             distance,
  //           };
  //         }

  //         if (distance < acc.distance) {
  //           return {
  //             branchIndex: index,
  //             distance,
  //           };
  //         }

  //         return acc;
  //       },
  //       null,
  //     );

  //     await ctx.telegram.sendLocation(
  //       ctx.update.message.chat.id,
  //       branches[nearestBranch?.branchIndex].longitude,
  //       branches[nearestBranch?.branchIndex].latitude,
  //     );

  //     ctx.reply(branches[nearestBranch?.branchIndex].name);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // @Hears(main.add)
  // addProduct(@Ctx() ctx: any) {
  //   const isOwn = ctx.message.forward_from ? false : true;
  //   if (!isOwn) {
  //     deletter(ctx);
  //     return;
  //   }
  //   return this.adminService.addProduct(ctx);
  // }

  async addProduct(ctx: any) {
    //xato wotta ekan
    console.log(1);

    ctx.session.menu = menus.addTitle;
    deletter(ctx);
    ctx.reply(addProduct_lan.name[ctx.session.language]);
    return;
  }

  @On('message')
  async message(@Ctx() ctx: any) {
    // addToKesh(ctx, ctx.message.message_id);
    let msg;
    switch (ctx.session.action) {
      case actions.register:
        msg = ctx.message.text ? ctx.message.text : null;
        if (
          msg === null ||
          msg !== keyboards.register[0] ||
          msg !== keyboards.register[1] ||
          msg !== keyboards.register[2]
        ) {
          ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        }
        return;

      case actions.sendContact:
        msg = ctx.message.contact ? ctx.message.contact : null;
        if (msg === null) {
          ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        }
        return;

      case actions.set_language:
        msg = ctx.message.text ? ctx.message.text : null;
        if (msg === null) {
          await ctx.telegram.deleteMessage(
            ctx.message.chat.id,
            ctx.message.message_id,
          );
          return;
        }

        const user = await this.userService.findOne(ctx.message.from.id);
        switch (msg) {
          case languages.uz:
            ctx.session.language = 0;
            this.lan = 0;
            if (user) {
              user.language_code = 0;
              await user.save();
            }
            addToKesh(ctx, ctx.message.message_id);
            ctx.session.action = actions.authorization;
            return this.authorization(ctx);

          case languages.en:
            ctx.session.language = 1;
            this.lan = 1;
            if (user) {
              user.language_code = 1;
              await user.save();
            }
            addToKesh(ctx, ctx.message.message_id);
            ctx.session.action = actions.authorization;
            return this.authorization(ctx);

          case languages.ru:
            ctx.session.language = 2;
            this.lan = 2;
            if (user) {
              user.language_code = 2;
              await user.save();
            }
            addToKesh(ctx, ctx.message.message_id);
            ctx.session.action = actions.authorization;
            return this.authorization(ctx);
          default:
            ctx.telegram.deleteMessage(
              ctx.message.chat.id,
              ctx.message.message_id,
            );
        }
    }

    const for_menu = ctx.message.text ? ctx.message.text : null;
    if (for_menu === main.home[0] || for_menu === main.home[1]) {
      ctx.session.page = user_pages.home;
      deletter(ctx);
      clearKesh(ctx);
    }
    if (for_menu === main.search[0] || for_menu === main.search[1]) {
      ctx.session.page = user_pages.search;
      await deletter(ctx);
      clearKesh(ctx);
    }
    if (for_menu === main.add[0] || for_menu === main.add[1]) {
      ctx.session.page = user_pages.adding;
      await deletter(ctx);
      clearKesh(ctx);
    }
    if (for_menu === main.question[0] || for_menu === main.question[1]) {
      ctx.session.page = user_pages.question;
      await deletter(ctx);
      clearKesh(ctx);
    }
    if (for_menu === main.cart[0] || for_menu === main.cart[1]) {
      ctx.session.page = user_pages.cart;
      await deletter(ctx);
      clearKesh(ctx);
    }

    let kesh;
    switch (ctx.session.page) {
      case user_pages.home:
        kesh = await ctx.reply('Home', await mainBtnMaker(1));
        clearKesh(ctx);
        addToKesh(ctx, kesh.message_id);
        return;

      case user_pages.search:
        clearKesh(ctx);
        kesh = await ctx.reply('Search', await mainBtnMaker(2));
        addToKesh(ctx, kesh.message_id);
        return;

      case user_pages.adding:
        clearKesh(ctx);

        kesh = await ctx.reply('Add product: ', await mainBtnMaker(3));
        addToKesh(ctx, kesh.message_id);
        if (ctx.session.menu === null) {
          console.log(ctx.session.menu);
          return this.addProduct(ctx);
        }
        const message = ctx.message.text;
        console.log(ctx.session.menu);

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
            if (!ctx.message?.photo) {
              ctx.reply(addProduct_lan.photo[1][ctx.session.language]);
              return;
            }
            ctx.session.product.photo_id =
              ctx.message.photo[ctx.message.photo.length - 1].file_id;
            ctx.session.menu = menus.addPrice;
            ctx.reply(addProduct_lan.price[ctx.session.language]);
            return;

          case menus.addPrice:
            ctx.session.menu = null;
            ctx.session.product.price = message;
            console.log(ctx.session.product);
            ctx.reply(addProduct_lan.ok[ctx.session.language]);

            const user = await this.userService.findOne(
              ctx.message.from.id + '',
            );
            ctx.session.product.author = user;

            const addedProduct = await this.productService.create({
              ...ctx.session.product,
              is_checked: false,
            });
            const data = {
              ...ctx.session.product,
              ...ctx.session.product.author,
              is_checked: false,
            };
          // console.log(productMaker(ctx, data, 0));
        }
        

      case user_pages.question:
        clearKesh(ctx);
        const { message_id, text } = ctx.message;
        const user_id = ctx.message.from.id;

        if (
          ctx.message.text !== main.question[0] &&
          ctx.message.text !== main.question[1]
        ) {
          await this.questionChatService.addMessage(ctx.message.from.id, text);
          deletter(ctx);
        }
        //habarlar tartibi buzilgan
        const chat = await this.questionChatService.findChat(user_id);
        if (chat.messages.length > 0) {
          chat.messages.forEach(async (message, index) => {
            if (index == chat.messages.length - 1) {
              const msg = await messageMaker(user_id, message);
              const kesh = await ctx.reply(msg, await mainBtnMaker(4));
              addToKesh(ctx, kesh.message_id);
              return;
            }
            const msg = await messageMaker(user_id, message);
            const kesh = await ctx.reply(msg);
            addToKesh(ctx, kesh.message_id);
          });
        }

        return;

      case user_pages.cart:
        kesh = await ctx.reply('Cart', await mainBtnMaker(5));
        clearKesh(ctx);
        addToKesh(ctx, kesh.message_id);
        return;
    }

    if (
      ctx.session.menu === menus.addTitle ||
      ctx.session.menu === menus.addDescription ||
      ctx.session.menu === menus.addPhoto ||
      ctx.session.menu === menus.addPrice
    ) {
      return this.adminService.message(ctx);
    }
  }
}
