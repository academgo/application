/**
 * Панель справа от квиза: что человек получит, кураторы, мессенджеры.
 *
 *   node content/import/quiz-sidebar.mjs            # сухой прогон
 *   node content/import/quiz-sidebar.mjs --apply    # запись в черновики квиза
 *
 * Пишет в черновики academgo.quiz.ru/en: preview-деплои их показывают,
 * основной сайт — нет, пока квиз не опубликуют. Пункты — только то, что
 * квиз обещает на финальном шаге («подборка программ, список вузов с ценами
 * в WhatsApp»), и бесплатная первая консультация, заявленная на сайте.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

const key = () => crypto.randomBytes(6).toString("hex");

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

const image = ref => ({ _type: "image", asset: { _type: "reference", _ref: ref } });

// Фото кураторов — из блока «О нас» на главной
const PHOTOS = {
  ilya: "image-91a3df0c0a7cb10119c0b440dc7ba3d7ad713e42-410x750-png",
  yan: "image-de8883c52048a1e912f0616dca41f1c31d220c71-410x750-png"
};

// Иконки и ссылки — как в блоке заявки на главной
const CONTACT_LINKS = [
  {
    title: "Whatsapp",
    icon: "image-86a70c8efc3b3954a8c2e2bda57335cb079f7618-50x50-svg",
    link: "https://api.whatsapp.com/send/?phone=48505118058&text&type=phone_number&app_absent=0"
  },
  {
    title: "Telegram",
    icon: "image-455b827805d80da9f4b3799d1ea6c1c89c59f476-50x50-svg",
    link: "https://t.me/infoacademgo"
  }
];

const SIDEBAR = {
  ru: {
    title: "Что вы получите",
    meta: "5 вопросов · около 2 минут",
    bullets: [
      "Подборку программ под ваши ответы: страна, бюджет, язык и сроки",
      "Список вузов с ценами",
      "Ответ в WhatsApp на номер из анкеты",
      "Первая консультация бесплатная"
    ],
    teamTitle: "Кураторы AcademGo",
    team: [
      { name: "Илья", photo: PHOTOS.ilya },
      { name: "Ян", photo: PHOTOS.yan }
    ],
    contactsText: "Удобнее написать сразу?"
  },
  en: {
    title: "What you get",
    meta: "5 questions · about 2 minutes",
    bullets: [
      "A shortlist of programmes matched to your country, budget, language and timing",
      "Universities with their fees",
      "Sent to the WhatsApp number you leave",
      "Your first consultation is free"
    ],
    teamTitle: "AcademGo supervisors",
    team: [
      { name: "Ilya", photo: PHOTOS.ilya },
      { name: "Yan", photo: PHOTOS.yan }
    ],
    contactsText: "Prefer to message us now?"
  }
};

const sidebarFor = lang => {
  const text = SIDEBAR[lang];
  return {
    ...text,
    team: text.team.map(person => ({
      _key: key(),
      name: person.name,
      photo: image(person.photo)
    })),
    contactLinks: CONTACT_LINKS.map(item => ({
      _key: key(),
      title: item.title,
      link: item.link,
      icon: image(item.icon)
    }))
  };
};

const api = async (endpoint, body) => {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/${endpoint}`;
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));
  return json;
};

const main = async () => {
  if (!token()) throw new Error("Нет SANITY_API_WRITE_TOKEN в .env.local");

  const ids = ["academgo.quiz.ru", "academgo.quiz.en"];
  const params = new URLSearchParams({
    perspective: "raw",
    query: "*[_id in $ids]",
    $ids: JSON.stringify(ids.flatMap(id => [id, `drafts.${id}`]))
  });
  const { result: docs } = await api(`query/${DATASET}?${params}`);

  const mutations = [];
  for (const id of ids) {
    const lang = id.endsWith(".en") ? "en" : "ru";
    const draft = docs.find(doc => doc._id === `drafts.${id}`);
    const published = docs.find(doc => doc._id === id);

    if (!draft && !published) {
      console.log(`${id}: документ не найден`);
      continue;
    }
    if (!draft) {
      const { _rev, _updatedAt, _createdAt, ...rest } = published;
      mutations.push({ createIfNotExists: { ...rest, _id: `drafts.${id}` } });
    }
    mutations.push({
      patch: { id: `drafts.${id}`, set: { sidebar: sidebarFor(lang) } }
    });
    console.log(`${id}: ${SIDEBAR[lang].title}, ${SIDEBAR[lang].bullets.length} пункта`);
  }

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  await api(`mutate/${DATASET}`, { mutations });
  console.log(`Записано мутаций: ${mutations.length}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
