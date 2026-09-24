/**
 * Загружает обложки стран в Sanity и ставит их на все страницы страны.
 *
 *   node content/import/upload-covers.mjs            # сухой прогон
 *   node content/import/upload-covers.mjs --apply    # загрузка
 *
 * Файлы берутся из content/covers, имя файла = код страны.
 * Одна обложка ставится на хаб, тематические страницы и карточки вузов
 * этой страны — в поле coverBlock.coverImage.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const COVERS = path.join(ROOT, "content/covers");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

/** имя файла → код страны, если они не совпадают */
const ALIASES = { cyprus: "south-cyprus" };

const ALT = {
  ru: {
    poland: "Учёба в Польше",
    turkey: "Учёба в Турции",
    uae: "Учёба в ОАЭ",
    malaysia: "Учёба в Малайзии",
    italy: "Учёба в Италии",
    spain: "Учёба в Испании",
    hungary: "Учёба в Венгрии",
    georgia: "Учёба в Грузии",
    "north-cyprus": "Учёба на Северном Кипре",
    "south-cyprus": "Учёба на Южном Кипре"
  },
  en: {
    poland: "Study in Poland",
    turkey: "Study in Türkiye",
    uae: "Study in the UAE",
    malaysia: "Study in Malaysia",
    italy: "Study in Italy",
    spain: "Study in Spain",
    hungary: "Study in Hungary",
    georgia: "Study in Georgia",
    "north-cyprus": "Study in North Cyprus",
    "south-cyprus": "Study in Cyprus"
  }
};

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
  if (!fs.existsSync(COVERS)) {
    console.error(`Нет папки с обложками: ${COVERS}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(COVERS)
    .filter(name => /\.(jpe?g|png|webp)$/i.test(name));

  // страницы стран: у них заполнено поле country
  const { result: pages } = await request(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type in ["singlepage", "subpage"] && defined(country)]{_id, language, "code": country->code, "hasCover": defined(coverBlock.coverImage)}'
    )}&perspective=drafts`
  );

  const assets = {};
  const mutations = [];

  for (const file of files) {
    const name = file.replace(/\.[^.]+$/, "");
    const code = ALIASES[name] || name;
    const pagesOfCountry = pages.filter(page => page.code === code);

    if (!pagesOfCountry.length) {
      console.log(`${file}: страниц страны «${code}» не нашлось, пропускаю`);
      continue;
    }

    if (APPLY) {
      const contentType = /\.png$/i.test(file)
        ? "image/png"
        : /\.webp$/i.test(file)
          ? "image/webp"
          : "image/jpeg";

      const { document } = await request(
        `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=cover-${file}`,
        {
          method: "POST",
          headers: { "Content-Type": contentType },
          body: fs.readFileSync(path.join(COVERS, file))
        }
      );

      assets[code] = document._id;
      console.log(`${file} → ${document._id} (${pagesOfCountry.length} страниц)`);
    } else {
      console.log(`${file} → ${code}: ${pagesOfCountry.length} страниц`);
    }

    pagesOfCountry.forEach(page => {
      mutations.push({
        patch: {
          id: page._id.startsWith("drafts.") ? page._id : `drafts.${page._id}`,
          set: {
            "coverBlock.coverImage": {
              _type: "image",
              asset: { _type: "reference", _ref: assets[code] }
            },
            "coverBlock.coverImageAlt":
              ALT[page.language]?.[code] || ALT.en[code] || ""
          }
        }
      });
    });
  }

  console.log(`\nСтраниц к правке: ${mutations.length}`);

  if (!APPLY) {
    console.log("Сухой прогон. Для загрузки добавьте --apply");
    return;
  }

  const chunk = 20;

  for (let i = 0; i < mutations.length; i += chunk) {
    await request(
      `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: mutations.slice(i, i + chunk) })
      }
    );

    console.log(`Обновлено ${Math.min(i + chunk, mutations.length)} из ${mutations.length}`);
  }

  console.log("Готово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
