import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  detectStudyDestination,
  studyCountryName
} from "@/lib/studyDestination";
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
  studyCountry?: string;
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

  // Ответ квиза о стране точнее адреса: на главной страны в адресе нет вовсе
  const destination =
    studyCountryName(data.studyCountry, data.lang) ||
    detectStudyDestination(data.url, data.lang);

  // В письмо идут все вопросы анкеты в том порядке, в каком их видел человек,
  // включая те, что добавили в Sanity уже после запуска
  const answers = data.quizAnswers.map((answer, index) => ({
    number: index + 1,
    label: isNonEmptyString(answer.label) ? answer.label : answer.name,
    value: isNonEmptyString(answer.value) ? answer.value : "—"
  }));

  const meta = [
    destination ? `Страна обучения: ${destination}` : "",
    isNonEmptyString(data.lang) ? `Язык сайта: ${data.lang}` : "",
    isNonEmptyString(data.url) ? `Страница: ${data.url}` : ""
  ].filter(Boolean);

  const text = [
    "Заявка с квиза",
    "",
    ...meta,
    "",
    `WhatsApp: ${data.whatsapp}`,
    "",
    "Ответы:",
    ...answers.map(
      answer => `${answer.number}. ${answer.label}: ${answer.value}`
    )
  ].join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #091728;">
      <h2 style="margin: 0 0 12px; font-size: 18px;">Заявка с квиза</h2>
      ${
        meta.length
          ? `<p style="margin: 0 0 12px; color: #4c5a6d;">${meta
              .map(escapeHtml)
              .join("<br/>")}</p>`
          : ""
      }
      <p style="margin: 0 0 16px;"><strong>WhatsApp:</strong> ${escapeHtml(
        data.whatsapp
      )}</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tbody>
          ${answers
            .map(
              answer => `<tr>
            <td style="border-bottom: 1px solid #e3e8ef; color: #4c5a6d;">${
              answer.number
            }. ${escapeHtml(answer.label)}</td>
            <td style="border-bottom: 1px solid #e3e8ef;"><strong>${escapeHtml(
              answer.value
            )}</strong></td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: destination ? `Заявка с квиза — ${destination}` : "Заявка с квиза",
    text,
    html
  };

  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
