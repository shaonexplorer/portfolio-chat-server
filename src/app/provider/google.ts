import { google } from "googleapis";
import { createGoogle } from '@ai-sdk/google';
import "dotenv/config";

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI, // e.g., https://developers.google.com/oauthplayground
);

// Set your tokens (you need a refresh token so it doesn't expire)
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export const gmail = google.gmail({ version: "v1", auth: oAuth2Client });





const googleAi = createGoogle({
  // custom settings
  apiKey: process.env.GOOGLE_API_KEY,
});

export const embeddingModel = googleAi.embeddingModel('gemini-embedding-001');