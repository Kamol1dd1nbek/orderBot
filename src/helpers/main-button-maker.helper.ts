import { Markup } from 'telegraf';
import { main } from '../enums/keyboard.enums';

export async function mainBtnMaker(page_id: number) {
  let keyboard_arr;
  if (page_id === 1) {
    keyboard_arr = [
      `[ ${main.home} ]`,
      main.search,
      main.add,
      main.question,
      main.cart,
    ];
  } else if (page_id === 2) {
    keyboard_arr = [
      main.home,
      `[ ${main.search} ]`,
      main.add,
      main.question,
      main.cart,
    ];
  } else if (page_id === 3) {
    keyboard_arr = [
      main.home,
      main.search,
      `[ ${main.add} ]`,
      main.question,
      main.cart,
    ];
  } else if (page_id === 4) {
    keyboard_arr = [
      main.home,
      main.search,
      main.add,
      `[ ${main.question} ]`,
      main.cart,
    ];
  } else if (page_id === 5) {
    keyboard_arr = [
      main.home,
      main.search,
      main.add,
      main.question,
      `[ ${main.cart} ]`,
    ];
  } else {
    throw new Error('Main button id not found');
  }
  return Markup.keyboard([keyboard_arr]).resize();
}
