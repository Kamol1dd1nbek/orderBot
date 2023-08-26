import { InjectModel } from '@nestjs/mongoose';
import { asistants, keyboards, languages, main } from './enums/keyboard.enums';
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
import { QuestionService } from './question/question.service';
import { addToKesh, clearKesh } from './helpers';
import { mainBtnMaker } from './helpers/main-button-maker.helper';
@errorHandler
@Update()
export class AppService {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private questionService: QuestionService,
  ) {}

  //START
  @Start()
  async start(@Ctx() ctx: any) {
    clearKesh(ctx);
    ctx.session.action = actions.set_language;
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
    });

    const mainButtons = Markup.keyboard([
      [main.home, main.search, main.add, main.question, main.cart],
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

  @On('message')
  async message(@Ctx() ctx: any) {
    let msg;
    switch (ctx.session.action) {
      case actions.register:
        msg = ctx.message.text ? ctx.message.text : null;
        if (
          msg === null ||
          msg !== keyboards.register[ctx.session.language] ||
          msg !== keyboards.register[ctx.session.language]
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
        switch (msg) {
          case languages.uz:
            ctx.session.language = 0;
            addToKesh(ctx, ctx.message.message_id);
            ctx.session.action = actions.authorization;
            return this.authorization(ctx);

          case languages.en:
            ctx.session.language = 1;
            addToKesh(ctx, ctx.message.message_id);
            ctx.session.action = actions.authorization;
            return this.authorization(ctx);

          case languages.ru:
            ctx.session.language = 2;
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
    if (for_menu === main.home) {
      ctx.session.page = user_pages.home;
      deletter(ctx);
    }
    if (for_menu === main.search) {
      ctx.session.page = user_pages.search;
      deletter(ctx);
    }
    if (for_menu === main.add) {
      ctx.session.page = user_pages.adding;
      deletter(ctx);
    }
    if (for_menu === main.question) {
      ctx.session.page = user_pages.question;
      deletter(ctx); 
    }
    if (for_menu === main.cart) {
      ctx.session.page = user_pages.cart;
      deletter(ctx);
    }

    switch (ctx.session.page) {
      case user_pages.home:
        ctx.reply("Home", await mainBtnMaker(1));
        return;
      case user_pages.search:
        ctx.reply('Search', await mainBtnMaker(2));
        return;
      case user_pages.adding:
        ctx.reply('Add', await mainBtnMaker(3));
        return;
      case user_pages.question:
      ctx.reply(asistants.beforeQuestion[ctx.session.language], await mainBtnMaker(4));
        await this.questionService.create({
          tg_id: ctx.message.from.id,
          message: ctx.message.text,
        });
        return;
      case user_pages.cart:
        ctx.reply('Cart', await mainBtnMaker(5));
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
