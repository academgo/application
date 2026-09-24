/**
 * Добавляет в меню пункт «Бесплатные материалы» со ссылками на посадочные
 * страницы лид-магнитов. Правит черновик шапки, живое меню не меняется.
 *
 *   node content/import/menu-magnets.mjs            # сухой прогон
 *   node content/import/menu-magnets.mjs --apply    # применить
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

const HEADER_IDS = {
  ru: "9cb19371-1f95-45fd-bbda-cb443f2b0e8a",
  en: "f9b34e02-e547-4181-9f54-c5984eb3aaf2"
};

/**
 * Ссылки в шапке хранятся в том же виде, что и остальные пункты:
 * в русской версии — с доменом, в английской — путём от корня.
 */
const MENU = {
  ru: {
    label: "Материалы",
    link: "academgo.com/ru/motivacionnoe-pismo",
    subLinks: [
      {
        label: "Мотивационное письмо: шаблон",
        link: "academgo.com/ru/motivacionnoe-pismo"
      },
      {
        label: "IELTS: какой балл нужен",
        link: "academgo.com/ru/ielts-dlya-postupleniya"
      },
      {
        label: "Документы и апостиль",
        link: "academgo.com/ru/dokumenty-dlya-postupleniya-za-granicu"
      }
    ]
  },
  en: {
    label: "Free guides",
    link: "/motivation-letter-template",
    subLinks: [
      {
        label: "Motivation letter template",
        link: "motivation-letter-template"
      },
      {
        label: "IELTS score you need",
        link: "ielts-score-for-university"
      },
      {
        label: "Documents and apostille",
        link: "documents-to-study-abroad"
      }
    ]
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

const main = async () => {
  const ids = Object.values(HEADER_IDS).flatMap(id => [id, `drafts.${id}`]);

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
      `*[_id in ${JSON.stringify(ids)}]{...}`
    )}`,
    { headers: { Authorization: `Bearer ${token()}` } }
  );

  const { result: headers } = await response.json();
  const documents = [];

  for (const [lang, id] of Object.entries(HEADER_IDS)) {
    const header =
      headers.find(item => item._id === `drafts.${id}`) ||
      headers.find(item => item._id === id);

    if (!header) {
      console.error(`Не найдена шапка (${lang})`);
      continue;
    }

    const item = {
      _key: "freeGuides",
      label: MENU[lang].label,
      link: MENU[lang].link,
      subLinks: MENU[lang].subLinks.map((subLink, index) => ({
        _key: `guide${index}`,
        ...subLink
      }))
    };

    // пункт ставим предпоследним, перед «Контактами»
    const navLinks = (header.navLinks || []).filter(
      link => link._key !== "freeGuides"
    );
    const withGuides = [
      ...navLinks.slice(0, navLinks.length - 1),
      item,
      ...navLinks.slice(navLinks.length - 1)
    ];

    documents.push({
      ...header,
      _id: header._id.startsWith("drafts.") ? header._id : `drafts.${id}`,
      navLinks: withGuides
    });

    console.log(
      `${lang}: ${withGuides.map(link => link.label).join(" · ")}`
    );
  }

  if (!APPLY) {
    console.log("\nСухой прогон. Для применения добавьте --apply");
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
      body: JSON.stringify({
        mutations: documents.map(document => ({ createOrReplace: document }))
      })
    }
  );

  const result = await mutateResponse.json();

  if (!mutateResponse.ok) {
    console.error("Ошибка:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log("\nГотово.");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
