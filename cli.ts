#!/usr/bin/env node

import { awaitReply, sendMessage } from "./shared";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const telegramTokenArg = args.find((x) => x.match(/\-\-telegramToken\=/));
  if (!telegramTokenArg) {
    console.log("Missing --telegramToken param");
    process.exit(1);
  }

  const telegramUserArg = args.find((x) =>
    x.match(/\-\-telegramUser\=[0-9]{7,10}/)
  );
  if (!telegramUserArg) {
    console.log("Missing or wrong --telegramUser param");
    process.exit(1);
  }

  const messageArg = args.find((x) => x.match(/\-\-message\=/));
  if (!messageArg) {
    console.log("Missing --message param");
    process.exit(1);
  }

  return {
    telegramToken: telegramTokenArg.replace("--telegramToken=", ""),
    telegramUser: telegramUserArg.replace("--telegramUser=", ""),
    message: messageArg.replace("--message=", ""),
  };
};

const start = async () => {
  const { telegramToken, telegramUser, message } = parseArgs();
  const { messageId } = await sendMessage(telegramToken, telegramUser, message);
  const response = await awaitReply(telegramToken, telegramUser, messageId);
  process.stdout.write(response);
  process.exit(0);
};

start();
