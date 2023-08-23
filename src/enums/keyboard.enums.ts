export const keyboards = {
    register: ["📝 Ro'yhatdan o'tish", "📝 Registration", "📝 Зарегистрироваться"],
    contact: ["📞 Raqamni yuborish", "📞 Send number", "📞 Отправить номер"],
    support: ["❓ Savol yo'llash", "❓ Send a question", "❓ Отправить вопрос"],
    location: ["📍 Joylashuvni yuborish", "📍 Send location", "📍 Отправить местоположение"],
    buyProduct: ["💸 Mahsulot sotib olish", "💸 Product purchase", "💸 Покупка товара"]
}

export enum roles {
    user,
    admin
}

export const admin_keyboards = {
    savollar: [""]
}

export const main = {
    home: "🏠",
    search: "🔍",
    add: "➕",
    like: "❤️",
    question: "❓",
    cart: "🛒",
    hamburger: "🍔"
}

export const languages = {
    uz: "🇺🇿 O'zbek",
    en: "🇺🇸 English",
    ru: "🇷🇺 Русский"
}

export const asistants = {
    welcome: ["Xush kelibsiz!", "Welcome", "Добро пожаловать"],
    toPhoneNumber: ["Telefon raqamingizni yuborish orqali ro'yxatdan o'ting", "Register by sending your phone number", "Зарегистрируйтесь, отправив свой номер телефона"],
    tabrikForLogin: ["🎉 Tabriklayman, muvaffaqiyatli ro'yxatdan o'tdingiz", "🎉 Congratulations, you have successfully registered", "🎉 Поздравляем, вы успешно зарегистрировались"],
    beforeQuestion: ["📝 Savolingizni yo'llashingiz mumkin?", "📝 Can you send your question?", "📝 Можете отправить свой вопрос?"],
}

export const admin_asistants = {
    salomWithAdmin: ["Assalomu aleykum, 👋 admin. Xush kelibsiz!", "Hello, 👋 admin. Welcome!", "Здравствуйте, 👋 админ. Добро пожаловать!"]
}

export const addProduct_lan = {
    name: ["🖋 Mahsulot nomini kiriting:", "🖋 Product name:", "🖋 Наименование товара:"],
    description: ["🖋 Mahsulot haqida:", "🖋 About the product:", "🖋 О товаре:"],
    photo: [["🖼 Mahsulot rasmi : ", "🖼 Product picture:", "🖼 Изображение товара:"], ["❌ Sizdan rasm fayli kutilmoqdaman", "❌ I am expecting an image file from you", "❌ Жду от вас файл изображения"]],
    price: ["💰 Mahsulot narxi:", "💰 Product price:", "💰 Цена товара:"],
    ok: ["✅ Muvaffaqiyatli qo'shildi", "✅ Added successfully", "✅ Добавлено успешно"]
}