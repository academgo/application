import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

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

// Токен нужен и на production: документы с точкой в _id (academgo.uae.hub.ru)
// Sanity считает приватными, анонимный запрос их не видит.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  ...(readToken ? { token: readToken } : {}),
  // "drafts" — новое имя перспективы previewDrafts: черновики поверх
  // опубликованных документов
  perspective: isPreview ? ("drafts" as const) : ("published" as const)
});

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: any) {
  return builder.image(source);
}
