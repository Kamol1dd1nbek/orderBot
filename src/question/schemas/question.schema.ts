import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ versionKey: false })
export class Question {
    @Prop({
        type: String,
        required: true
    })
    tg_id: string;

    @Prop({
        type: String,
        required: true
    })
    message: string;

    @Prop({
        type: Types.ObjectId,
        ref: "QuestionChat"
    })
    question_chat_id: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);