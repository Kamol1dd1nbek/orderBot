import { InjectModel } from '@nestjs/mongoose';
import { keyboards, main } from './enums/keyboard.enums';
import { Update, Start, Ctx, Hears, On } from 'nestjs-telegraf';
import { Context, Markup, session } from 'telegraf';
import { Branch } from './schemas/branch.schema';
import { Model } from 'mongoose';
import { getDistance } from './utils/get-distance.util';
import { isAdmin } from './utils/is-admin.util';
import { AdminService } from './admin/admin.service';
import { UserService } from './user/user.service';
import errorHandler from './decorators/errorHandler.decorator';
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
    const id = ctx.update.message.from.id + '';

    if (isAdmin(id)) {
      return this.adminService.start(ctx);
    }

    const user = await this.userService.findOne(id);
    if (user) {
      ctx.telegram.sendMessage(ctx.chat.id, 'Xush kelibsiz', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    } else {
      const keyboard = Markup.keyboard([keyboards.register, keyboards.support])
        .resize()
        .oneTime();
      ctx.reply('Xush kelibsiz', keyboard);
    }
  }

  //REGISTER
  @Hears(keyboards.register)
  register(@Ctx() ctx: Context) {
    const keyboard = Markup.keyboard([
      Markup.button.contactRequest(keyboards.contact),
    ])
      .resize() 
      .oneTime();
    ctx.reply(
      "Marhamat telefon raqamingizni yuborgan holatda ro'yxatdan o'ting",
      keyboard,
    );
  }

  //SUPPORT
  @Hears(keyboards.support)
  support(@Ctx() ctx: Context) {
    ctx.reply('Savolingizni yuboring');
  }

  //ON CONTACT
  @On('contact')
  async contact(@Ctx() ctx: any) {
    const phoneNumber = ctx.update.message.contact.phone_number;
    
    // save to DB
    const user = ctx.update.message.from;
    // const newUser = await this.userService.create({
    //   tg_id: user.id,
    //   first_name: user.first_name,
    //   last_name: user.last_name,
    //   phone_number: phoneNumber,
    //   is_bot: user.is_bot,
    //   username: user.username
    // });

    const mainButtons = Markup.keyboard([[main.home, main.search, main.add, main.like, main.cart]]).resize();
    ctx.reply("Tabriklayman, muvaffaqiyatli ro'yxatdan o'tdingiz", mainButtons);
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

  @Hears(keyboards.addProduct)
  addProduct(@Ctx() ctx: any){
    if ( isAdmin(ctx.from.id + "") ) {
      return this.adminService.addProduct(ctx);
    }
  }

  @On('message')
  message(@Ctx() ctx: any) {
    if ( isAdmin(ctx.from.id + "") ) {
      return this.adminService.message(ctx);
    }
  } 
}
