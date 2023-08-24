import { Types } from 'mongoose';
import { Context, Markup } from 'telegraf';

const fields = {
    name: "🖌  Name:         ",
    description: "📝 Description:  ",
    price: "💰 Price:        ",
    author: "👤 Author:       ",
    contact: "📞 Contact:      "
}

export function productMaker(ctx: Context ,data: {
  name: string;
  description: string;
  photo_id: string;
  price: number;
  author: {
    tg_id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}, type: number) {
    const tab = "    ";
    const keyboard = Markup.inlineKeyboard([{text: "Confirm", callback_data: "create_ok"}, {text: "Cancel", callback_data: "create_no"}]);
    
    const payload =`
${fields.name}${data.name},
    
${fields.description}${data.description || "*********"},

${fields.price}${data.price} so\`m,

${fields.author}${data.author.first_name} ${data.author.last_name || "..."}
    
${fields.contact}${data.author.phone}
`;

    if ( type ) { 
        ctx.telegram.sendPhoto(ctx.chat.id, data.photo_id, {
            caption: payload
        });
    } else {
        ctx.telegram.sendPhoto(ctx.chat.id, data.photo_id, {
            caption: payload,
            reply_markup: keyboard.reply_markup
        });
    }

} 