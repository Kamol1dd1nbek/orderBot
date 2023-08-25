import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

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
        type: [Types.ObjectId]
    })
    messages: [Types.ObjectId];
}

export const QuestionChatSchema = SchemaFactory.createForClass(QuestionChat);