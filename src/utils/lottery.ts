import { bot } from "..";
import { IUser } from "../interfaces/User";
import { User } from "../models/User";
import { WORD } from "../utils/word";

export function startLottery() {
    setInterval(async () => {
        const date = new Date();
        if (date.getHours() === 11) {
            const users: IUser[] = await User.find();
            const validUsers = users.filter(user => user.isValid);

            const winner = chooseWinner(validUsers);

            validUsers.forEach((user: IUser) => {
                bot.telegram.sendMessage(user.chatId, `${WORD} дня сегодня - ${winner.name}! Поздравляем!`);
                bot.telegram.sendPhoto(user.chatId, winner.photoId);
            });
        }
    }, 1801000);
}

function chooseWinner(users: IUser[]): IUser {
    const index = Math.floor(Math.random() * users.length);
    return users[index];
}
