import { Context } from "telegraf";

export function addToKesh(ctx: any, id: number) {
    ctx.session.kesh.push(id);
}

export function clearKesh(ctx: any) {
    ctx.session.kesh = [];
}