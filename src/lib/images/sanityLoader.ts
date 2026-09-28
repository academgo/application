/**
 * Global `next/image` loader (see `images.loaderFile` in next.config.mjs).
 *
 * Images are resized and re-encoded by Sanity's own image CDN instead of
 * Vercel's `/_next/image` optimizer, whose monthly transformation quota this
 * site was spending. Sanity serves the right width for each `srcset` entry and
 * WebP or AVIF to browsers that accept it (`auto=format`).
 *
 * Only `cdn.sanity.io/images/...` URLs can be transformed. Everything else —
 * Sanity `files/` assets, local `/images/...`, other hosts — is returned as
 * is. `?w=` is still appended to local paths so each `srcset` entry is a
 * distinct URL; static file serving ignores the query.
 */
type LoaderArgs = { src: string; width: number; quality?: number };

const SANITY_IMAGES = "https://cdn.sanity.io/images/";

export default function sanityLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith(SANITY_IMAGES)) {
    const url = new URL(src);
    // Keep crop/hotspot params urlFor() already added (rect, fp-x, …).
    // Overrides any width urlFor() baked in (e.g. .width(900)): the srcset
    // entry decides the width.
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    // Never upscale a small source: a 465px icon asked for at 1080w stays 465px.
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
    return url.toString();
  }

  if (src.startsWith("/")) {
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  }

  return src;
}
