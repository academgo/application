import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export async function POST(request: NextRequest) {
  const data = await request.json();

  const transport = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const langLine = isNonEmptyString(data.lang)
    ? `Language: ${data.lang}\n`
    : "";
  const urlLine = isNonEmptyString(data.url) ? `Page URL: ${data.url}\n` : "";
  const meta = `${langLine}${urlLine}${langLine || urlLine ? "\n" : ""}`;

  let mailBody = "";
  let isValid = false;

  // 1) legacy multi-step (старый формат)
  if (
    data.question1 &&
    data.question2 &&
    data.question3 &&
    data.question4 &&
    data.whatsapp
  ) {
    mailBody =
      meta +
      `Кто заполняет: ${data.question1}\n` +
      `Уровень образования: ${data.question2}\n` +
      `Начало обучения: ${data.question3}\n` +
      `Бюджет: ${data.question4}\n` +
      `Whatsapp: ${data.whatsapp}`;
    isValid = true;
  }
  // 2) phone-only (FormSuperLite сюда попадет)
  else if (data.phone && !data.country && !data.whatsapp && !data.email) {
    mailBody = meta + `Телефон: ${data.phone}`;
    isValid = true;
  }
  // 3) phone+country+email
  else if (data.phone && data.country && data.email && !data.whatsapp) {
    mailBody =
      meta +
      `Телефон: ${data.phone}\n` +
      `Страна: ${data.country}\n` +
      `Email: ${data.email}`;
    isValid = true;
  }
  // 4) whatsapp-only
  else if (data.whatsapp && !data.phone && !data.country && !data.email) {
    mailBody = meta + `Whatsapp: ${data.whatsapp}`;
    isValid = true;
  } else {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Запрос с Academgo`,
    text: mailBody
  };

  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
