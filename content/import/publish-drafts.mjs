/**
 * Публикация и снятие с публикации черновиков, созданных импортом.
 *
 * В Sanity «опубликовать» — значит скопировать документ drafts.X в X и удалить
 * черновик. В студии это кнопка Publish в каждом документе; здесь то же самое
 * пакетами по API.
 *
 *   node content/import/publish-drafts.mjs                       # что будет опубликовано
 *   node content/import/publish-drafts.mjs --only turkey         # одна страна
 *   node content/import/publish-drafts.mjs --type country        # только справочники
 *   node content/import/publish-drafts.mjs --apply               # публикация
 *   node content/import/publish-drafts.mjs --unpublish --apply   # снять с публикации
 *
 * Шапка и главная НЕ публикуются без флага --with-layout: их публикация
 * меняет живое меню и главную страницу.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";
// публикация идёт через Actions API, он появился в этой версии
const ACTIONS_API_VERSION = "2024-05-23";
const PREFIX = "academgo.";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const UNPUBLISH = args.includes("--unpublish");
const WITH_LAYOUT = args.includes("--with-layout");
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const TYPE = args.includes("--type") ? args[args.indexOf("--type") + 1] : null;

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

/**
 * Код страны из id документа:
 *   academgo.turkey.hub.ru                     → turkey
 *   academgo.country.turkey.ru                 → turkey
 *   academgo.university.turkey.medipol.ru      → turkey
 *   academgo.compare.ru                        → null (общая страница)
 */
const countryOf = id => {
  const parts = id.replace(/^drafts\./, "").split(".");
  if (parts[0] !== "academgo") return null;

  if (parts[1] === "country" || parts[1] === "university") return parts[2];
  if (parts[1] === "compare" || parts[1] === "quiz" || parts[1] === "tm") {
    return null;
  }

  return parts[1];
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
      ...(options.headers || {})
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(result, null, 2));
  }

  return result;
};

const query = async groq =>
  (
    await request(
      `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
        groq
      )}`
    )
  ).result;

const runActions = async actions => {
  const chunkSize = 10; // ограничение Actions API

  for (let i = 0; i < actions.length; i += chunkSize) {
    const chunk = actions.slice(i, i + chunkSize);

    await request(
      `https://${PROJECT_ID}.api.sanity.io/v${ACTIONS_API_VERSION}/data/actions/${DATASET}`,
      { method: "POST", body: JSON.stringify({ actions: chunk }) }
    );

    console.log(
      `Обработано ${Math.min(i + chunkSize, actions.length)} из ${actions.length}`
    );
  }
};

// ------------------------------------------------------------------ публикация

const publish = async () => {
  const documents = await query(
    `*[_id in path("drafts.**")][_id match "drafts.${PREFIX}*"]{_id, _type}`
  );

  const selected = documents.filter(document => {
    const publishedId = document._id.replace(/^drafts\./, "");

    if (TYPE && document._type !== TYPE) return false;
    if (ONLY && countryOf(publishedId) !== ONLY) return false;

    return true;
  });

  // черновики шапки и главной: у них обычные id, префикса academgo нет,
  // поэтому берём их отдельно и только по флагу
  const layoutDrafts = WITH_LAYOUT
    ? await query(
        `*[_id in path("drafts.**") && _type in ["header", "homepage"]]{_id, _type}`
      )
    : [];

  const all = [...selected, ...layoutDrafts];

  if (!all.length) {
    console.log("Черновиков под эти условия не нашлось.");
    return;
  }

  const byType = all.reduce((acc, document) => {
    acc[document._type] = (acc[document._type] || 0) + 1;
    return acc;
  }, {});

  console.log("К публикации:", byType);

  if (!APPLY) {
    console.log("\nСухой прогон. Для публикации добавьте --apply");
    return;
  }

  await runActions(
    all.map(document => ({
      actionType: "sanity.action.document.publish",
      draftId: document._id,
      publishedId: document._id.replace(/^drafts\./, "")
    }))
  );

  console.log("Опубликовано.");
};

// --------------------------------------------------------- снятие с публикации

const unpublish = async () => {
  const documents = await query(
    `*[!(_id in path("drafts.**"))][_id match "${PREFIX}*"]{_id, _type}`
  );

  const selected = documents.filter(document => {
    if (TYPE && document._type !== TYPE) return false;
    if (ONLY && countryOf(document._id) !== ONLY) return false;
    return true;
  });

  if (!selected.length) {
    console.log("Опубликованных документов под эти условия нет.");
    return;
  }

  console.log(`К снятию с публикации: ${selected.length}`);

  if (!APPLY) {
    console.log("\nСухой прогон. Чтобы снять, добавьте --apply");
    return;
  }

  // возвращаем документ в черновики: публикация исчезает с сайта,
  // содержимое остаётся в drafts
  await runActions(
    selected.map(document => ({
      actionType: "sanity.action.document.unpublish",
      draftId: `drafts.${document._id}`,
      publishedId: document._id
    }))
  );

  console.log("Снято с публикации.");
};

const main = async () => {
  if (!token()) {
    console.error("Нет токена: добавьте SANITY_API_TOKEN в .env.local");
    process.exit(1);
  }

  if (UNPUBLISH) {
    await unpublish();
    return;
  }

  await publish();
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
