import { createClient } from 'next-sanity';
import ImageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;
const apiVersion = '2023-10-16';
const useCdn = process.env.NODE_ENV === 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

const builder = ImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source)
}