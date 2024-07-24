import { NextRequest, NextResponse } from "next/server";
import { getBlogPostsByLangWithPagination } from "@/sanity/sanity.utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  if (!lang || !limit || !offset) {
    return NextResponse.json(
      { error: "Missing query parameters" },
      { status: 400 }
    );
  }

  try {
    const posts = await getBlogPostsByLangWithPagination(
      lang,
      parseInt(limit),
      parseInt(offset)
    );
    const total = posts.length; // Предположим, что вы можете получить общее количество постов

    return NextResponse.json({ posts, total }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 }
    );
  }
}
