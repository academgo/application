import { createClient } from "next-sanity";
import ImageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;
const apiVersion = "2023-10-16";

// На preview-деплоях читаем черновики: новые страны загружаются в production
// как drafts и не видны на основном сайте, пока их не опубликуют.
const readToken =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;
const isPreview =
  Boolean(readToken) &&
  (process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "development");

const useCdn = process.env.NODE_ENV === "production" && !isPreview;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  // "drafts" — новое имя перспективы previewDrafts: черновики поверх
  // опубликованных документов
  ...(isPreview ? { token: readToken, perspective: "drafts" as const } : {})
});

const builder = ImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
