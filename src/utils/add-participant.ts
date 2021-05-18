import { Context } from "telegraf";
import { Update, Message } from "typegram";
import { User } from "../models/User";
import { WINNER } from "./lottery";
import { WORD } from "./word";

export async function addParticipant(ctx: Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>) {
    ctx.reply(`Ты - легенда программирования из комитетной? И хочешь немного азарта? Тогда ты по адресу! С этого момента ты имеешь уникальный шанс на статус "${WORD}" дня!`);
    ctx.reply(`/help для просмотра возможных команд`);
    if (WINNER?.name) {
        ctx.reply(`"${WORD}" дня сегодня - ${WINNER?.name}!`);
    }
    

    const candidate = await User.findOne({
        id: ctx.from.id
    });

    if (!candidate) {
        const photosResponse = await ctx.telegram.getUserProfilePhotos(ctx.from.id);
        let photo = '';

        try {
            photo = photosResponse?.photos[0][0].file_id;
        } catch(e) {
            console.log(e);
            photo = '';
        }

        const participant = new User({
            id: ctx.from.id,
            name: `${ctx.from.first_name} ${ctx.from.last_name || ''}`,
            photoId:  photo,
            chatId: ctx.from.id,
            isValid: true,
            countPick: 0
        });
    
        await participant.save();
    } else {
        await candidate.setValid(true);
    }
};