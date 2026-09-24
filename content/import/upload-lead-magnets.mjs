/**
 * Загружает PDF лид-магнитов в Sanity и записывает id файлов в
 * content/import/lead-magnet-assets.json — оттуда их берёт импорт страниц.
 *
 *   node content/import/upload-lead-magnets.mjs
 *
 * Повторный запуск перезаливает файлы: Sanity сам склеивает одинаковые
 * по содержимому, поэтому дублей не появляется.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PDF_DIR = path.join(ROOT, "content/lead-magnets/out");
const ASSETS_FILE = path.join(__dirname, "lead-magnet-assets.json");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

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

const main = async () => {
  if (!fs.existsSync(PDF_DIR)) {
    console.error(
      "Нет PDF. Сначала соберите их: node content/lead-magnets/build-pdf.mjs"
    );
    process.exit(1);
  }

  const files = fs.readdirSync(PDF_DIR).filter(name => name.endsWith(".pdf"));
  const assets = {};

  for (const file of files) {
    const body = fs.readFileSync(path.join(PDF_DIR, file));

    const response = await fetch(
      `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/files/${DATASET}?filename=${encodeURIComponent(
        file
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
          Authorization: `Bearer ${token()}`
        },
        body
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Ошибка загрузки:", file, JSON.stringify(result, null, 2));
      process.exit(1);
    }

    const [magnet, lang] = file.replace(/\.pdf$/, "").split("-");
    assets[`${magnet}-${lang}`] = result.document._id;

    console.log(`${file} → ${result.document._id}`);
  }

  fs.writeFileSync(ASSETS_FILE, JSON.stringify(assets, null, 2) + "\n");
  console.log(`\nID файлов записаны: ${ASSETS_FILE}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
