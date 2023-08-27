import { Markup } from 'telegraf';
import { main } from '../enums/keyboard.enums';

export async function mainBtnMaker(page_id: number) {
  let keyboard_arr;
  if (page_id === 1) {
    keyboard_arr = [
      main.home[1],
      main.search[0],
      main.add[0],
      main.question[0],
      main.cart[0],
    ];
  } else if (page_id === 2) {
    keyboard_arr = [
      main.home[0],
      main.search[1],
      main.add[0],
      main.question[0],
      main.cart[0],
    ];
  } else if (page_id === 3) {
    keyboard_arr = [
      main.home[0],
      main.search[0],
      main.add[1],
      main.question[0],
      main.cart[0],
    ];
  } else if (page_id === 4) {
    keyboard_arr = [
      main.home[0],
      main.search[0],
      main.add[0],
      main.question[1],
      main.cart[0],
    ];
  } else if (page_id === 5) {
    keyboard_arr = [
      main.home[0],
      main.search[0],
      main.add[0],
      main.question[0],
      main.cart[1],
    ];
  } else {
    throw new Error('Main button id not found');
  }
  return Markup.keyboard([keyboard_arr]).resize();
}
