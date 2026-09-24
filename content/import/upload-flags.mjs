/**
 * Загружает флаги стран в Sanity и проставляет их в документы Country
 * (обе языковые версии).
 *
 *   node content/import/upload-flags.mjs --dir <папка с png>            # сухой прогон
 *   node content/import/upload-flags.mjs --dir <папка с png> --apply    # загрузка
 *
 * Имя файла = код страны: poland.png, turkey.png, uae.png, malaysia.png,
 * italy.png, spain.png, hungary.png, georgia.png, north-cyprus.png,
 * south-cyprus.png.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const DIR = args.includes("--dir")
  ? args[args.indexOf("--dir") + 1]
  : path.join(ROOT, "content/flags");

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

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token()}`, ...(options.headers || {}) }
  });

  const result = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(result, null, 2));

  return result;
};

const main = async () => {
  if (!token()) {
    console.error("Нет токена: добавьте SANITY_API_TOKEN в .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(DIR)) {
    console.error(`Нет папки с флагами: ${DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DIR).filter(name => name.endsWith(".png"));

  if (!files.length) {
    console.error(`В папке ${DIR} нет png-файлов`);
    process.exit(1);
  }

  // какие страны есть в Sanity
  const { result: countries } = await request(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type == "country"]{_id, code, language, "hasFlag": defined(flag)}'
    )}&perspective=drafts`
  );

  const assets = {};

  for (const file of files) {
    const code = file.replace(/\.png$/, "");

    if (!countries.some(country => country.code === code)) {
      console.log(`${file}: страны с кодом «${code}» нет в Sanity, пропускаю`);
      continue;
    }

    if (!APPLY) {
      assets[code] = "(сухой прогон)";
      continue;
    }

    const { document } = await request(
      `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=flag-${file}`,
      {
        method: "POST",
        headers: { "Content-Type": "image/png" },
        body: fs.readFileSync(path.join(DIR, file))
      }
    );

    assets[code] = document._id;
    console.log(`${file} → ${document._id}`);
  }

  const patches = countries
    .filter(country => assets[country.code])
    .map(country => ({
      patch: {
        // правим черновик: на живом сайте флаги появятся при публикации
        id: country._id.startsWith("drafts.")
          ? country._id
          : `drafts.${country._id}`,
        set: {
          flag: {
            _type: "image",
            asset: { _type: "reference", _ref: assets[country.code] }
          }
        }
      }
    }));

  console.log(
    `\nФлагов: ${Object.keys(assets).length}, документов Country к правке: ${patches.length}`
  );

  if (!APPLY) {
    console.log("Сухой прогон. Для загрузки добавьте --apply");
    return;
  }

  await request(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mutations: patches })
    }
  );

  console.log("Готово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
