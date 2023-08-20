import { InjectModel } from '@nestjs/mongoose';
import { keyboards } from './enums/keyboard.enums';
import { Update, Start, Ctx, Hears, On } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { Branch } from './schemas/branch.schema';
import { Model } from 'mongoose';
import { getDistance } from './utils/get-distance.util';

@Update()
export class AppService {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
  ) {}

  //START
  @Start()
  start(@Ctx() ctx: Context) {
    const keyboard = Markup.keyboard([keyboards.register, keyboards.support])
      .resize()
      .oneTime();
    ctx.reply('salom', keyboard);
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
      "Marhamat telefon raqamingizni yuborgan holatda ro'yhatdan o'ting",
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
  contact(@Ctx() ctx: any) {
    console.log(ctx);

    const phoneNumber = ctx.update.message.contact.phone_number;
    // save to DB

    const keyboard = Markup.keyboard([
      Markup.button.locationRequest(keyboards.location),
    ])
      .resize()
      .oneTime();

    ctx.reply('Endi joylashuvingizni yuboring', keyboard);
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

  @On("message")
  message(@Ctx() ctx: any) {
    console.log(ctx.update.message.from)
  }
}
