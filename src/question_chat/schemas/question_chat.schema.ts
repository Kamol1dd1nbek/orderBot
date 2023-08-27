import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { CreateMessage } from "../dto/create-message.dto";

export type QuestionChatDocument = HydratedDocument<QuestionChat>;

@Schema({ versionKey: false })
export class QuestionChat {
    @Prop({
        type: Number,
        default: 0
    })
    not_answered: number;

    @Prop({
        type: String,
        required: true
    })
    user_id: string;


    @Prop({
        type: [Object],
        default: []
    })
    messages: [CreateMessage]; 
}

export const QuestionChatSchema = SchemaFactory.createForClass(QuestionChat);