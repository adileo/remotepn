# Remote Prompt Notification

Do you need some user prompt while executing a server bash script or scheduled server code?
Remote Prompt Notification is here for you! It sends a Telegram notification, the answer will be received by your script.
Also supporting 👍 and 👎 emoji to output a Y or N string.

- Lightweight (less than 10kb)
- No depedency
- Use Telegram API with native node fetch

# How to use it

1. Create a BOT with bothfather and take note of the TOKEN

2. Get your user ID in telegram by adding the bot @userinfobot you will receive your user id number (eg. 101111333)

## Bash / Shell

```bash
npx remotepn --telegramToken=6953209111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA --telegramUser=101111333 --message="How are you?"
```

## Javascript / Typescript

```typescript
import RemotePN from "remotepn";
const client = new RemotePN({
  telegramToken: "6953209111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  telegramUser: 101111333,
});
const answer = await client.prompt("Hello World");
```

## Answering

You can either answer the message by long pressing the message and "Answer" or use a reaction
