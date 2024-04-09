#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// shared.ts
var import_node_fetch = __toESM(require("node-fetch"));
var postRequest = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};
var sendMessage = async (token, username, message) => {
  const response = await (0, import_node_fetch.default)(
    "https://api.telegram.org/bot" + token + "/sendMessage",
    {
      ...postRequest,
      body: JSON.stringify({
        chat_id: username,
        text: message
      })
    }
  );
  const jsonResponse = await response.json();
  if (!jsonResponse.ok) {
    console.error("Error while sending: ", jsonResponse);
    process.exit(1);
  }
  return {
    messageId: jsonResponse.result.message_id
  };
};
var awaitReply = async (token, userId, messageId) => {
  let offset = 0;
  while (true) {
    const response = await (0, import_node_fetch.default)(
      "https://api.telegram.org/bot" + token + "/getUpdates",
      {
        ...postRequest,
        body: JSON.stringify({
          offset,
          timeout: 25,
          allowed_updates: ["message", "message_reaction", "poll_answer"]
        })
      }
    );
    const jsonResponse = await response.json();
    if (jsonResponse.ok) {
      const found = jsonResponse.result.find(
        (res) => res.message && res.message.from.id == userId && res.message.chat.id == userId && res.message.reply_to_message && res.message.reply_to_message.message_id === messageId || res.message_reaction && res.message_reaction.chat.id == userId && res.message_reaction.user.id == userId && res.message_reaction.message_id == messageId
      );
      if (found && found.message) {
        return found.message.text;
      } else if (found && found.message_reaction) {
        if (found.message_reaction.new_reaction.find((x) => x.emoji == "\u{1F44D}")) {
          return "Y";
        } else if (found.message_reaction.new_reaction.find((x) => x.emoji == "\u{1F44E}")) {
          return "N";
        }
      } else if (jsonResponse.length >= 100) {
        offset = jsonResponse.result.slice(-1).update_id;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 5e3));
  }
};

// cli.ts
var parseArgs = () => {
  const args = process.argv.slice(2);
  const telegramTokenArg = args.find((x) => x.match(/\-\-telegramToken\=/));
  if (!telegramTokenArg) {
    console.log("Missing --telegramToken param");
    process.exit(1);
  }
  const telegramUserArg = args.find(
    (x) => x.match(/\-\-telegramUser\=[0-9]{7,10}/)
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
    message: messageArg.replace("--message=", "")
  };
};
var start = async () => {
  const { telegramToken, telegramUser, message } = parseArgs();
  const { messageId } = await sendMessage(telegramToken, telegramUser, message);
  const response = await awaitReply(telegramToken, telegramUser, messageId);
  process.stdout.write(response);
  process.exit(0);
};
start();
