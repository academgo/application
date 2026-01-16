import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

type QuizAnswer = {
  name: string;
  label: string;
  value: string;
};

type QuizPayload = {
  whatsapp: string;
  quizAnswers: QuizAnswer[];
  lang?: string;
  url?: string;
};

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const isQuizAnswerArray = (v: unknown): v is QuizAnswer[] =>
  Array.isArray(v) &&
  v.every(x => {
    if (!x || typeof x !== "object") return false;
    const obj = x as any;

    return (
      typeof obj.name === "string" &&
      typeof obj.label === "string" &&
      typeof obj.value === "string"
    );
  });

export async function POST(request: NextRequest) {
  const data = (await request.json()) as Partial<QuizPayload>;

  if (
    !isNonEmptyString(data.whatsapp) ||
    !isQuizAnswerArray(data.quizAnswers)
  ) {
    return NextResponse.json(
      { error: "Invalid quiz payload" },
      { status: 400 }
    );
  }

  const transport = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const lines = data.quizAnswers
    .filter(a => a.value)
    .map(a => `${a.label}: ${a.value}`);

  const langLine = isNonEmptyString(data.lang)
    ? `Language: ${data.lang}\n\n`
    : "";
  const urlLine = isNonEmptyString(data.url) ? `Page URL: ${data.url}\n\n` : "";

  const mailBody = `${langLine}${urlLine}${lines.join("\n")}\n\nWhatsapp: ${data.whatsapp}`;

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Новый лид",
    text: mailBody
  };

  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
