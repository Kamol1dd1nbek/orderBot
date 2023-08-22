import { Types } from 'mongoose';
import { Context } from 'telegraf';

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
    // console.log(data);
    
  const payload = 
`
    Name:           ${data.name},
    
    Description:    ${data.description || "*********"},

    Price:          ${data.price} so\`m,

    Author:         ${data.author.first_name} ${data.author.last_name || "..."}
    
    Contact:        ${data.author.phone}
`;

    if ( type ) {
        ctx.telegram.sendPhoto(ctx.chat.id, data.photo_id, {
            caption: payload
        });
    } else {
        ctx.telegram.sendPhoto(ctx.chat.id, data.photo_id, {
            caption: payload
        });
    }

}
