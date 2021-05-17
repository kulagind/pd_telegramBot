export interface IUser {
    id: number,
    name: string,
    chatId: number,
    photoId: string,
    isValid: true,
    countPick: number,
    pick: () => Promise<IUser>,
    setValid: (value: boolean) => Promise<IUser>,
    setPhoto: (value: string) => Promise<IUser>,
}