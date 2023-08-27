import { CreateMessage } from "./create-message.dto";

export class CreateChatDto {
    not_answered: number;
    user_id: string;
    admin_id: string;
    messages: [CreateMessage]
}