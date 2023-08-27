import { Context } from 'telegraf';

export async function deletter(ctx: Context) {
  try {
    await ctx.telegram.deleteMessage(
      ctx.message.chat.id,
      ctx.message.message_id,
    );
  } catch (error) {
    console.log(error.message);
  }
}
