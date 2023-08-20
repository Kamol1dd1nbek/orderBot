import { keyboards } from './enums/keyboard.enums';
import { Update, Start, Ctx, Hears, On } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';

@Update()
export class AppService {
  //START
  @Start()
  start(@Ctx() ctx: Context) {
    const keyboard = Markup.keyboard([
      keyboards.register,
      keyboards.support
    ])
      .resize()
      .oneTime();
    ctx.reply("salom", keyboard);
  }

  //REGISTER
  @Hears(keyboards.register)
  register(@Ctx() ctx: Context) {
    const keyboard = Markup.keyboard([
      Markup.button.contactRequest(keyboards.contact)
    ])
      .resize()
      .oneTime();
    ctx.reply(
      "Marhamat telefon raqamingizni yuborgan holatda ro'yhatdan o'ting",
      keyboard
    );
  }

  //SUPPORT
  @Hears(keyboards.support)
  support(@Ctx() ctx: Context) {
    ctx.reply("Savolingizni yuboring");
  }

  //ON CONTACT
  @On("contact")
  contact(@Ctx() ctx: any) {
    console.log(ctx);
    
    const phoneNumber = ctx.update.message.contact.phone_number;
    // save to DB

    const keyboard = Markup.keyboard([
      Markup.button.locationRequest(keyboards.location)
    ])
      .resize()
      .oneTime();
      
    ctx.reply("Endi joylashuvingizni yuboring", keyboard);
  }
}
