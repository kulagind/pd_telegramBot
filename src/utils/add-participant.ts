import { Context } from "telegraf";
import { Update, Message } from "typegram";
import { User } from "../models/User";
import { WORD } from "./word";

export async function addParticipant(ctx: Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>) {
    ctx.reply(`Ты - легенда программирования из комитетной? И хочешь немного азарта? Тогда ты по адресу! С этого момента ты имеешь уникальный шанс на статус "${WORD}" дня!`);

    const candidate = await User.findOne({
        id: ctx.from.id
    });

    if (!candidate) {
        const photosResponse = await ctx.telegram.getUserProfilePhotos(ctx.from.id);

        const participant = new User({
            id: ctx.from.id,
            name: `${ctx.from.first_name} ${ctx.from.last_name}`,
            photoId: photosResponse?.photos[0][0].file_id || '',
            chatId: ctx.from.id,
            isValid: true,
            countPick: 0
        });
    
        await participant.save();
    } else {
        await candidate.setValid(true);
    }
};