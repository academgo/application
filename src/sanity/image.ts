import { createImageUrlBuilder } from "@sanity/image-url";

// Отдельно от sanity.client.ts: urlFor нужен клиентским компонентам, а импорт
// клиента Sanity тянул бы в браузерный бандл весь @sanity/client (~85 КБ).
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string
});

export function urlFor(source: any) {
  return builder.image(source);
}
