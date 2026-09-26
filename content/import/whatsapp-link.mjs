/**
 * Замена ссылки на WhatsApp во всех документах Sanity — черновиках и
 * опубликованных версиях (шапка, подвал, главная, квиз, формы и мессенджеры
 * на страницах). Любая ссылка на api.whatsapp.com / wa.me / whatsapp://
 * заменяется на WHATSAPP_URL.
 *
 *   node content/import/whatsapp-link.mjs            # сухой прогон
 *   node content/import/whatsapp-link.mjs --apply    # запись
 *
 * Опубликованные документы меняются сразу — это живой сайт.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

export const WHATSAPP_URL = "https://wa.me/message/5EJRNM3WEDXAC1";

const APPLY = process.argv.includes("--apply");
const WHATSAPP =
  /^(https?:\/\/)?(api\.whatsapp\.com|wa\.me|web\.whatsapp\.com)\/|^whatsapp:\/\//i;

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

// Пути для patch: элементы массивов адресуем по _key, если он есть
const collect = (value, pathSoFar, found) => {
  if (typeof value === "string") {
    if (WHATSAPP.test(value.trim()) && value.trim() !== WHATSAPP_URL) {
      found.push({ path: pathSoFar, from: value });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collect(
        item,
        `${pathSoFar}[${item && item._key ? `_key=="${item._key}"` : index}]`,
        found
      )
    );
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key.startsWith("_")) continue;
      collect(item, pathSoFar ? `${pathSoFar}.${key}` : key, found);
    }
  }
};

const main = async () => {
  if (!token()) throw new Error("Нет SANITY_API_WRITE_TOKEN в .env.local");

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/export/${DATASET}`,
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  const docs = (await response.text())
    .trim()
    .split("\n")
    .map(line => JSON.parse(line))
    .filter(
      doc =>
        !doc._type?.startsWith("system.") && !doc._type?.startsWith("sanity.")
    );

  const mutations = [];
  const byType = {};
  for (const doc of docs) {
    const found = [];
    collect(doc, "", found);
    if (!found.length) continue;

    const kind = `${doc._type}${doc._id.startsWith("drafts.") ? " (черновик)" : ""}`;
    byType[kind] = (byType[kind] || 0) + 1;
    mutations.push({
      patch: {
        id: doc._id,
        ifRevisionID: doc._rev,
        set: Object.fromEntries(found.map(item => [item.path, WHATSAPP_URL]))
      }
    });
  }

  console.log(`Документов со старой ссылкой: ${mutations.length}`);
  console.log(byType);

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  for (let index = 0; index < mutations.length; index += 50) {
    const result = await fetch(
      `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mutations: mutations.slice(index, index + 50) })
      }
    );
    if (!result.ok) throw new Error(await result.text());
  }
  console.log(`Записано: ${mutations.length}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
