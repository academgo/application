import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0NzQ2MTI0NCwiYWFpIjoxMSwidWlkIjo2OTYwMTEyOCwiaWFkIjoiMjAyNC0xMi0xMlQxMjo0MjoxMS4yOTZaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjY5NDk0MzgsInJnbiI6ImV1YzEifQ.L636NyAGC0pzHD24_d2g-OAgLEnKL5ljTfWgD6lKRds";
const BOARD_ID = "1741071358";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { country, phone, email } = body;

    const query = `
      mutation {
        create_item (
          board_id: ${BOARD_ID},
          item_name: "${country}",
          column_values: ${JSON.stringify(
            JSON.stringify({
              tekst_Mjj5PRDd: phone, // Указание идентификатора колонки телефона
              tekst_Mjj5fnLd: email
            })
          )}
        ) {
          id
        }
      }
`;

    const response = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_API_KEY
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Errors from monday.com API:", data.errors);
      return NextResponse.json(
        { error: "Error while creating item in monday.com" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Lead successfully sent to monday.com" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
