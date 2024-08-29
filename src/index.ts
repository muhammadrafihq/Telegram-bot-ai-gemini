import express from "express";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5000;
const telegramToken = process.env.TELEGRAM_BOT_TOKEN!;

const bot = new TelegramBot(telegramToken, { polling: true });

let chat: ChatSession | null = null;

async function mediaToGenerativePart(fileLink: string, mimeType: string) {
  try {
    const response = await axios.get(fileLink, { responseType: "arraybuffer" });
    const base64Data = Buffer.from(response.data, "binary").toString("base64");
    return {
      inlineData: { data: base64Data, mimeType: mimeType },
    };
  } catch (error) {
    console.error("Error downloading media from Telegram:", error);
    return null;
  }
}

async function run(
  message: string,
  chatId: number,
  mediaPart?: any
): Promise<void> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!chat) {
      chat = model.startChat({
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
    }

    let prompt: any[] = [message];

    if (mediaPart) {
      prompt.push(mediaPart);
    }

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text: string = response.text();

    if (text) {
      await sendTelegramMessage(text, chatId);
    } else {
      console.error(
        "This problem is related to Model Limitations and API Rate Limits"
      );
    }
  } catch (error) {
    console.error("Error in run function:", error);
    await sendTelegramMessage(
      "Oops, an error occurred. Please try again later.",
      chatId
    );
  }
}

async function sendTelegramMessage(
  text: string,
  chatId: number
): Promise<void> {
  try {
    await bot.sendMessage(chatId, text);
  } catch (err) {
    console.error("Failed to send Telegram message:");
    console.error("Error details:", err);
  }
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  let mediaPart = null;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileLink = await bot.getFileLink(fileId);

    const mimeType = "image/jpeg";
    mediaPart = await mediaToGenerativePart(fileLink, mimeType);

    if (mediaPart) {
      await run("Image received", chatId, mediaPart);
    }
  } else if (msg.text) {
    const message = msg.text;
    await run(message, chatId);
  } else if (msg.document) {
    const fileId = msg.document.file_id;
    const fileLink = await bot.getFileLink(fileId);
    const mimeType = msg.document.mime_type || "application/octet-stream";
    mediaPart = await mediaToGenerativePart(fileLink, mimeType);
    if (mediaPart) {
      await run("Document received", chatId, mediaPart);
    } else {
      await sendTelegramMessage(
        "Failed to process the document. Please try again.",
        chatId
      );
    }
  } else if (msg.video) {
    const fileId = msg.video.file_id;
    const fileLink = await bot.getFileLink(fileId);
    const mimeType = msg.video.mime_type || "video/mp4";
    mediaPart = await mediaToGenerativePart(fileLink, mimeType);
    if (mediaPart) {
      await run("Video received", chatId, mediaPart);
    } else {
      await sendTelegramMessage(
        "Failed to process the video. Please try again.",
        chatId
      );
    }
  } else if (msg.audio) {
    const fileId = msg.audio.file_id;
    const fileLink = await bot.getFileLink(fileId);
    const mimeType = msg.audio.mime_type || "audio/mpeg";

    mediaPart = await mediaToGenerativePart(fileLink, mimeType);

    if (mediaPart) {
      await run("Audio received", chatId, mediaPart);
    } else {
      await sendTelegramMessage(
        "Failed to process the audio. Please try again.",
        chatId
      );
    }
  } else if (msg.voice) {
    const fileId = msg.voice.file_id;
    const fileLink = await bot.getFileLink(fileId);
    const mimeType = msg.voice.mime_type || "audio/ogg";

    mediaPart = await mediaToGenerativePart(fileLink, mimeType);

    if (mediaPart) {
      await run("Voice message received", chatId, mediaPart);
    } else {
      await sendTelegramMessage(
        "Failed to process the voice message. Please try again.",
        chatId
      );
    }
  } else {
    await sendTelegramMessage(
      "Unsupported message type received. Please send a text message, photo, document, video, or audio.",
      chatId
    );
  }
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));
