import { IUser } from "../interfaces/User";

export function compareScores(user1: IUser, user2: IUser): number {
    if (user1.countPick < user2.countPick) {
        return -1;
    }
    if (user1.countPick > user2.countPick) {
        return 1;
    }
    return 0;
}