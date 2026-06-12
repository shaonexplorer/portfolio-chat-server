import { NextFunction, Request, Response } from "express";

import ejs from "ejs";
import path from "path";
import { resend } from "../../provider/resend.js";

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  const senderInfo = req.body;
  try {
    // 1. Define your dynamic data
    const emailData = {
      subject: senderInfo.subject,
      companyName: senderInfo.name,
      companyEmail: senderInfo.email,

      //   name: "Alex",
      messageBody: senderInfo.text,
      //   actionUrl: "https://example.com/dashboard",
      //   actionText: "Go to Dashboard",
    };
    // 2. Render the EJS template to an HTML string
    const templatePath = path.join(
      process.cwd(),
      "file",
      "email",
      "email-template.ejs",
    );
    const htmlContent = await ejs.renderFile(templatePath, emailData);

    // const info = await transporter.sendMail({
    //   from: senderInfo.email, // sender address
    //   to: "shaonexplorer@gmail.com", // list of recipients
    //   subject: senderInfo.subject, // subject line
    //   //   text: `Email from : ${senderInfo.email}
    //   //          Email body : ${senderInfo.text}`, // plain text body
    //   html: htmlContent, // HTML body
    // });

    const info = await resend.emails.send({
      from: senderInfo.email,
      to: "shaonexplorer@gmail.com",
      subject: "Hello World",
      html: htmlContent,
    });

    console.log("Message sent: %s", info);

    return info;
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export const sendMessageService = {
  sendMessage,
};
