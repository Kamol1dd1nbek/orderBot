export async function messageMaker(user_id, message) {
    if (message.user_id == user_id) {
        return `🫵 ${message.message}`;
    } else {
        return `👤 ${message.message}`;
    }
}