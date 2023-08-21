import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product {
    @Prop({
        type: String,
        min: 2,
        max: 50,
        required: true
    })
    name: string;

    @Prop({
        type: String
    })
    description: string;

    @Prop({
        type: String,
        required: true
    })
    photo_id: string;

    @Prop({
        type: Number,
        required: true
    })
    price: number;

    @Prop({
        type: Types.ObjectId,
        ref: "User"
    })
    author_id: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref: "Category"
    })
    category_id: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);