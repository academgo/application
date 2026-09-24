/**
 * Убирает из меню пункты-заглушки (ссылка «/link»).
 * Правит и опубликованную шапку, и её черновик.
 *
 *   node content/import/fix-header-links.mjs            # показать, что уберём
 *   node content/import/fix-header-links.mjs --apply    # убрать
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

const token = () => {
  const envPath = path.join(ROOT, ".env.local");
  const names = ["SANITY_API_WRITE_TOKEN", "SANITY_API_TOKEN"];

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const name of names) {
      const line = lines.find(item => item.startsWith(`${name}=`));
      if (line) return line.split("=").slice(1).join("=").trim();
    }
  }

  return names.map(name => process.env[name]).find(Boolean);
};

const isPlaceholder = link => {
  const value = (link || "").trim().toLowerCase();
  return value === "/link" || value === "link" || value === "#";
};

const main = async () => {
  const query = '*[_type == "header"]{...}';
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token()}` }
  });
  const { result: headers } = await response.json();

  const mutations = [];

  for (const header of headers) {
    const removed = [];

    const navLinks = (header.navLinks || [])
      .filter(item => {
        if (isPlaceholder(item.link)) {
          removed.push(`${header._id}: пункт «${item.label}»`);
          return false;
        }
        return true;
      })
      .map(item => {
        if (!item.subLinks) return item;

        const subLinks = item.subLinks.filter(subLink => {
          if (isPlaceholder(subLink.link)) {
            removed.push(`${header._id}: подпункт «${subLink.label}»`);
            return false;
          }
          return true;
        });

        return { ...item, subLinks };
      });

    if (!removed.length) continue;

    removed.forEach(line => console.log("-", line));
    mutations.push({ patch: { id: header._id, set: { navLinks } } });
  }

  if (!mutations.length) {
    console.log("Заглушек не найдено.");
    return;
  }

  if (!APPLY) {
    console.log("\nСухой прогон. Для правки добавьте --apply");
    return;
  }

  const mutateResponse = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({ mutations })
    }
  );

  const result = await mutateResponse.json();

  if (!mutateResponse.ok) {
    console.error("Ошибка:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("Готово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
