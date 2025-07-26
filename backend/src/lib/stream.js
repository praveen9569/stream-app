// stream.js
import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async ({ id, name, image }) => {
  const userData = { id, name, image };
  try {
    await streamClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.error("Error upserting user stream:", error);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
     const userIdstr= userId.toString();
    return streamClient.createToken(userIdstr);
    
  } catch (error) {
    
  }
};
