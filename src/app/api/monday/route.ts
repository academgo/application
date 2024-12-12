import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0NzcxNDExMiwiYWFpIjoxMSwidWlkIjo2OTYwNTY3NywiaWFkIjoiMjAyNC0xMi0xMlQyMDo1NzoyMC4yMjhaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjY5NTE0NTYsInJnbiI6ImV1YzEifQ.u8FRD_sus0o43AqGNgWMstYyT5L8VA0ZKbm8HJrYupM";
const BOARD_ID = "1741411541";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    const query = `
      mutation {
        create_item (
          board_id: ${BOARD_ID},
          item_name: "${name}",
          column_values: ${JSON.stringify(
            JSON.stringify({
              lead_phone: phone, // Указание идентификатора колонки телефона
              lead_email: email // Убедитесь, что колонка email совпадает с её идентификатором в Monday.com
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
