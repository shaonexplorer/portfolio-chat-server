import { Resend } from "resend";
import "dotenv/config";

const api_key = process.env.RESEND_API_KEY;

export const resend = new Resend(api_key);
