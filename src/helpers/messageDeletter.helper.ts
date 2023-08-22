import { Context } from "telegraf";

export function deletter(ctx: Context) {
    ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
}