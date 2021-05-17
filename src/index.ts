import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import mongoose from 'mongoose';
import { addParticipant } from './utils/add-participant';
import { WORD, setWord } from './utils/word';
import { User } from './models/User';
import { IUser } from './interfaces/User';
import { compareScores } from './utils/compare-scores';
import { startLottery } from './utils/lottery';

export const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);

mongoose.connect('mongodb://mongodb:27017/pd', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(_ => {
    bot.launch();
    startLottery();
});

bot.start(addParticipant);

bot.help((ctx) => ctx.reply(`
    Для смены фотографии отправь боту фото в сжатом варианте.
    Доступные команды:
    word новый_статус - сменить разыгрываемый статус;
    list - посмотреть список твоих конкурентов за статус "${WORD}";
    _я_-_гей_ - команда для прекращения участия в лотерее (нижние подчеркивание нужно заменить на пробелы);
`));

bot.hears('list', async (ctx) => {
    const users: IUser[] = await User.find();
    const list = users
        .sort(compareScores)
        .reduce((acc: string, user: IUser, index: number) => {
            const userInfo = user.isValid ? `${index + 1}) ${user.name} (${user.countPick})\n` : '';
            return acc + userInfo;
        }, '');
    ctx.reply(list);
});

bot.hears(/^word [А-Яа-я]{0,99}$/g, (ctx) => {
    setWord(ctx.update.message.text.substr(5));
    ctx.reply('Новое слово: ' + WORD);
});

bot.hears('я - гей', (ctx) => {
    ctx.reply(`Эх, ${ctx.from.first_name}, не ожидали от тебя такого! Но на самом деле фраза для прекращения участия "leave"`);
});

bot.hears('leave', async (ctx) => {
    ctx.reply(`${ctx.from.first_name}, прощай!`);
    const candidate = await User.findOne({
        id: ctx.from.id
    });
    if (candidate) {
        await candidate.setValid(false);
    }
});

bot.on("photo", async (ctx) => {
    const candidate = await User.findOne({
        id: ctx.from.id
    });

    if (candidate) {
        await candidate.setPhoto(ctx.message?.photo[0].file_id || '');
    }
});
