# Remote Prompt Notification

Looking for a way to prompt users for a string or OTP while running a server bash script or scheduled server code? Look no further than Remote Prompt Notification! This npm package sends a Telegram notification where users can respond, and the answer will be received by your script. Plus, it supports thumbs-up 👍 and thumbs-down 👎 emojis to output a "Y" or "N" string for easy interaction.

- Lightweight (less than 10kb)
- Zero external depedencies
- Uses Telegram APIs with native node fetch

# How to use it

1. Create a BOT on Telegram with Bothfather and take note of the bot TOKEN
2. Start a chat with your bot on Telegram (Important in order to allow the BOT to send messages to you)
3. Retrieve your Telegram User ID in telegram by starting a chat with `@userinfobot` you will receive your user id number (eg. 101111333)

## Bash / Shell

Command:

```bash
npx remotepn --telegramToken=6953209111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA --telegramUser=101111333 --message="How are you?"
```

Output: Message answer string or "Y"/"N" in case of thumbs-up or thumbs-down reaction.

## Javascript / Typescript

```bash
npm i remotepn
```

```typescript
import RemotePN from "remotepn";
const client = new RemotePN({
  telegramToken: "6953209111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  telegramUser: 101111333,
});
const answer = await client.prompt("Hello World");
console.log(answer); // Message answer string or "Y"/"N" in case of thumbs-up or thumbs-down reaction.
```

## Answering

You have to specifically answer the message, not just sending a message to the bot as an answer. Or you can use thumbs-up or thumbs-down reaction.
