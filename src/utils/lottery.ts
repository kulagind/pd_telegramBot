import { bot } from "..";
import { IUser } from "../interfaces/User";
import { User } from "../models/User";
import { WORD } from "../utils/word";

export function initLottery() {
    setInterval(async () => {
        const date = new Date();
        if (date.getHours() === 11) {
            const winner = await startLottery();
            await winner.pick();
        }
    }, 1801000);
}

export async function startLottery(isTest: boolean = false): Promise<IUser> {
    const users: IUser[] = await User.find();
    const validUsers = users.filter(user => user.isValid);

    const winner = chooseWinner(validUsers);

    validUsers.forEach((user: IUser) => {
        if (isTest) {
            bot.telegram.sendMessage(user.chatId, `Тестовый прогон лотереи, не обращайте внимания.`);
        }
        bot.telegram.sendMessage(user.chatId, `${WORD} дня сегодня - ${winner.name}! Поздравляем!`);
        bot.telegram.sendPhoto(user.chatId, winner.photoId);
    });

    return winner;
}

function chooseWinner(users: IUser[]): IUser {
    const index = Math.floor(Math.random() * users.length);
    return users[index];
}
