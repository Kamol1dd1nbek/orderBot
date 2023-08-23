import { InjectModel } from '@nestjs/mongoose';
import { asistants, keyboards, languages, main } from './enums/keyboard.enums';
import { Update, Start, Ctx, Hears, On } from 'nestjs-telegraf';
import { Context, Markup, session } from 'telegraf';
import { Branch } from './schemas/branch.schema';
import { Model } from 'mongoose';
import { getDistance } from './utils/get-distance.util';
import { isAdmin } from './utils/is-admin.util';
import { AdminService } from './admin/admin.service';
import { UserService } from './user/user.service';
import errorHandler from './decorators/errorHandler.decorator';
import { actions, menus } from './enums/menus.enum';
import { deletter } from './helpers/messageDeletter.helper';
@errorHandler
@Update()
export class AppService {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  //START
  @Start()
  async start(@Ctx() ctx: any) {
    ctx.session.action = actions.set_language;
    ctx.session.menu = null;
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
    ctx.session.action = actions.set_language;
    ctx.reply(salomlashish, languagesButton);
  }

  async authorization(ctx: any) {
    console.log(ctx.session.user);
    const id = ctx.update.message.from.id + '';
    const mainButtons = Markup.keyboard([
      [main.home, main.search, main.add, main.like, main.cart],
    ]).resize();
    if (ctx.session.user) {
      ctx.telegram.sendMessage(
        ctx.chat.id,
        asistants.welcome[ctx.session.language],
        mainButtons,
      );
    } else {
      const user = await this.userService.findOne(id);
      console.log('lan', ctx.session.language);
      if (user) {
        ctx.session.user = user;
        ctx.telegram.sendMessage(
          ctx.chat.id,
          asistants.welcome[ctx.session.language],
          mainButtons,
        );
      } else {
        console.log(2);
        const keyboard = Markup.keyboard([
          keyboards.register[ctx.session.language],
          keyboards.support[ctx.session.language],
        ])
          .resize()
          .oneTime();
        ctx.session.action = actions.registerOrSuppot;
        ctx.reply(asistants.welcome[ctx.session.language], keyboard);
      }
    }
  }

  //REGISTER
  @Hears(keyboards.register)
  register(@Ctx() ctx: any) {
    const keyboard = Markup.keyboard([
      Markup.button.contactRequest(keyboards.contact[ctx.session.language]),
    ])
      .resize()
      .oneTime();
    ctx.session.action = actions.sendContact;
    ctx.reply(asistants.toPhoneNumber[ctx.session.language], keyboard);
  }

  //ON CONTACT
  @On('contact')
  async contact(@Ctx() ctx: any) {
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
      [main.home, main.search, main.add, main.like, main.cart],
    ]).resize();

    if (isAdmin(user.id)) {
      return this.adminService.start(ctx);
    }
    ctx.reply(asistants.tabrikForLogin[ctx.session.language], mainButtons);
    ctx.session.action = actions.free;
    ctx.session.user = newUser;
  }

  //ON LOCATION
  @On('location')
  async location(@Ctx() ctx: any) {
    try {
      const location = ctx.update.message.location;

      const branches = await this.branchModel.find({});

      const nearestBranch = branches.reduce(
        (acc: any, branch: any, index: number) => {
          const distance = getDistance(
            branch.latitude,
            location.latitude,
            branch.longitude,
            location.longitude,
          );

          if (!acc) {
            return {
              branchIndex: index,
              distance,
            };
          }

          if (distance < acc.distance) {
            return {
              branchIndex: index,
              distance,
            };
          }

          return acc;
        },
        null,
      );

      await ctx.telegram.sendLocation(
        ctx.update.message.chat.id,
        branches[nearestBranch?.branchIndex].longitude,
        branches[nearestBranch?.branchIndex].latitude,
      );

      ctx.reply(branches[nearestBranch?.branchIndex].name);
    } catch (error) {
      console.log(error);
    }
  }
  
  @Hears(main.add)
  addProduct(@Ctx() ctx: any) {
    
    const isOwn = ctx.message.forward_from ? false : true;
    if (!isOwn) {
      deletter(ctx);
      return;
    }
    return this.adminService.addProduct(ctx);
  }

  @Hears(keyboards.support)
  sendQuestion(@Ctx() ctx: any) {
    ctx.session.action = actions.sendQuestion;
    ctx.reply(asistants.beforeQuestion[ctx.session.language], {
      reply_markup: { remove_keyboard: true },
    });
  }



  @On('message')
  async message(@Ctx() ctx: any) {

    let message;
    if (
      ctx.session.menu === menus.addTitle ||
      ctx.session.menu === menus.addDescription ||
      ctx.session.menu === menus.addPhoto ||
      ctx.session.menu === menus.addPrice
    ) {
      return this.adminService.message(ctx);
    }
    if (ctx.session.action === actions.set_language) {
      message = ctx.message.text ? ctx.message.text : null;
      if (message === null) {
        ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        return;
      }
      switch (message) {
        case languages.uz:
          ctx.session.language = 0;
          ctx.session.action = actions.authorization;
          return this.authorization(ctx);
        case languages.en:
          ctx.session.language = 1;
          ctx.session.action = actions.authorization;
          return this.authorization(ctx);
        case languages.ru:
          ctx.session.language = 2;
          ctx.session.action = actions.authorization;
          return this.authorization(ctx);
        default:
          ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
      }
    }
    if (!ctx.session.user && ctx.session.action !== actions.registerOrSuppot) {
      ctx.session.action = actions.authorization;
      ctx.session.menu = null;
    }

    switch (ctx.session.action) {
      case actions.registerOrSuppot:
        message = ctx.message.text ? ctx.message.text : null;
        if (
          message === null ||
          message !== keyboards.register[ctx.session.language] ||
          message !== keyboards.register[ctx.session.language]
        ) {
          ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        }
        return;
      case actions.sendContact:
        message = ctx.message.contact ? ctx.message.contact : null;
        if (message === null) {
          ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        }
        return;
      case actions.sendQuestion:
        message = ctx.message.text ? ctx.message.text : null;
        if (message === null) {

          ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        } else {

          ctx.session.action = actions.free;
          ctx.telegram.forwardMessage(
            process.env.ADMIN_ID_1,
            ctx.message.chat.id,
            ctx.message.message_id,
          );
          // admin ga kelgan savollarni db saqlash admin savollar bolimiga o'tganida db dan olib keliw kk kn javob yoziwi kk .....
        }
    }

    if (isAdmin(ctx.from.id + '')) {
      return this.adminService.message(ctx);
    }
  }
}