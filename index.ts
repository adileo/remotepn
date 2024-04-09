import { awaitReply, sendMessage } from "./shared";

export default class RemotePN {
  telegramToken: string;
  telegramUser: string;

  constructor({
    telegramToken,
    telegramUser,
  }: {
    telegramToken: string;
    telegramUser: string;
  }) {
    this.telegramToken = telegramToken;
    this.telegramUser = telegramUser;
  }
  async prompt(message: string) {
    const { messageId } = await sendMessage(
      this.telegramToken,
      this.telegramUser,
      message
    );
    const response = await awaitReply(
      this.telegramToken,
      this.telegramUser,
      messageId
    );
    return response;
  }
}
