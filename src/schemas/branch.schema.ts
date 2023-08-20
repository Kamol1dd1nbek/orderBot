import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BranchDocument = HydratedDocument<Branch>;

@Schema({ versionKey: false })
export class Branch {
    @Prop({
        type: String,
        required: true
    })
    name: string;

    @Prop({
        type: Number,
        required: true
    })
    latitude: number;

    @Prop({
        type: Number,
        required: true
    })
    longitude: number;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);