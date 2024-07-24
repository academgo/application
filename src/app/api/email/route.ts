import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  let mailBody = "";
  if (data.phone && data.country && data.whatsapp) {
    // Обработка данных из существующей формы
    mailBody = `Email: ${data.email}\nPhone: ${data.phone}\nCountry: ${data.country}\nWhatsapp: ${data.whatsapp}`;
  } else if (data.question1 && data.question2) {
    // Обработка данных из новой многошаговой формы
    mailBody = `Question 1: ${data.question1}\nQuestion 2: ${data.question2}\nEmail: ${data.email}`;
  } else {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Client from Academgo`,
    text: mailBody
  };

  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
