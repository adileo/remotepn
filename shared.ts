import fetch from "node-fetch";

const postRequest = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};
export const sendMessage = async (
  token: string,
  username: string,
  message: string
) => {
  const response = await fetch(
    "https://api.telegram.org/bot" + token + "/sendMessage",
    {
      ...postRequest,
      body: JSON.stringify({
        chat_id: username,
        text: message,
      }),
    }
  );
  const jsonResponse = await response.json();
  if (!jsonResponse.ok) {
    console.error("Error while sending: ", jsonResponse);
    process.exit(1);
  }
  return {
    messageId: jsonResponse.result.message_id,
  };
};

export const awaitReply = async (
  token: string,
  userId: string,
  messageId: number
) => {
  let offset = 0;
  while (true) {
    const response = await fetch(
      "https://api.telegram.org/bot" + token + "/getUpdates",
      {
        ...postRequest,
        body: JSON.stringify({
          offset,
          timeout: 25,
          allowed_updates: ["message", "message_reaction", "poll_answer"],
        }),
      }
    );
    const jsonResponse = await response.json();

    if (jsonResponse.ok) {
      const found = jsonResponse.result.find(
        (res: any) =>
          (res.message &&
            res.message.from.id == userId &&
            res.message.chat.id == userId &&
            res.message.reply_to_message &&
            res.message.reply_to_message.message_id === messageId) ||
          (res.message_reaction &&
            res.message_reaction.chat.id == userId &&
            res.message_reaction.user.id == userId &&
            res.message_reaction.message_id == messageId)
      );

      if (found && found.message) {
        return found.message.text;
      } else if (found && found.message_reaction) {
        if (
          found.message_reaction.new_reaction.find((x: any) => x.emoji == "👍")
        ) {
          return "Y";
        } else if (
          found.message_reaction.new_reaction.find((x: any) => x.emoji == "👎")
        ) {
          return "N";
        }
      } else if (jsonResponse.length >= 100) {
        offset = jsonResponse.result.slice(-1).update_id;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};
