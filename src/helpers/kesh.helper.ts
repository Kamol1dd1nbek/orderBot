import { Context } from 'telegraf';

export function addToKesh(ctx: any, id: number) {
  ctx.session.kesh.push(id);
}

export function clearKesh(ctx: any) {
  const kesh = ctx.session.kesh ? ctx.session.kesh : [];
  if (kesh === 0) return;  
  kesh.forEach(async (m_id) => {
    try {
      await ctx.telegram.deleteMessage(ctx.message.chat.id, m_id);
    } catch (error) {
      console.log(error.message);
    }
  });
  ctx.session.kesh = [];
}
