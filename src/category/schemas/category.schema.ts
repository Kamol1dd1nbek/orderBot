import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ versionKey: false })
export class Category {
    @Prop({
        type: String,
        required: true
    })
    name: string;

    @Prop({
        type: String
    })
    description: string;

    @Prop({
        type: Types.ObjectId,
        ref: "Category"
    })
    parent_category: ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);