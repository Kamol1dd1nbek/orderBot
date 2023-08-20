import { Types } from "mongoose";

export class CreateCategoryDto {
    name: string;
    description: string;
    parent_category: Types.ObjectId
}
