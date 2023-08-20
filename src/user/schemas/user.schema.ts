import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;
 
@Schema({ versionKey: false })
export class User {
    @Prop({
        type: String,
        required: true
    })
    tg_id: string;

    @Prop({
        type: String,
        required: true
    })
    first_name: string;

    @Prop({
        type: String
    })
    last_name: string;

    @Prop({
        type: String
    })
    username: string;

    @Prop({
        type: Boolean,
        required: true
    })
    is_bot: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);