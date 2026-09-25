import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import {
  detectStudyDestination,
  studyCountryName
} from "@/lib/studyDestination";

type LeadMagnetPayload = {
  email: string;
  name?: string;
  magnet?: string;
  lang?: string;
  url?: string;
  studyCountry?: string;
};

const isEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export async function POST(request: NextRequest) {
  const data = (await request.json()) as Partial<LeadMagnetPayload>;

  if (!isEmail(data.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
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

  // Страна из поля формы (общие страницы) или из адреса страницы страны
  const destination =
    studyCountryName(data.studyCountry, data.lang) ||
    detectStudyDestination(data.url, data.lang);

  const mailBody = [
    `Материал: ${data.magnet || "не указан"}`,
    destination ? `Страна обучения: ${destination}` : "",
    data.name ? `Имя: ${data.name}` : "",
    `E-mail: ${data.email}`,
    data.lang ? `Language: ${data.lang}` : "",
    data.url ? `Page URL: ${data.url}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Скачивание материала",
    text: mailBody
  };

  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
