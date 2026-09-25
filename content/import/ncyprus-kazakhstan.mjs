/**
 * Северный Кипр: вопрос в FAQ страницы о признании диплома — признают ли
 * диплом ТРСК в Казахстане (факт NC-22 в content/facts/north-cyprus-recognition.md).
 *
 *   node content/import/ncyprus-kazakhstan.mjs            # сухой прогон
 *   node content/import/ncyprus-kazakhstan.mjs --apply    # запись в черновик
 *
 * Сам риск отказа в Казахстане уже прямо описан на хабе, странице
 * поступления, стоимости, карточках CIU, EMU, GAU, NEU и в таблице на
 * странице о признании — здесь только отдельный вопрос для FAQ и поиска.
 * Правила — в редакции 2021 года: актуальную версию проверка не открыла,
 * поэтому в ответе есть дата приказа и совет проверить в ENIC-Kazakhstan.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { key, markdownToPortableText } from "./markdown-to-portable-text.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const APPLY = process.argv.includes("--apply");

const PAGE = "academgo.north-cyprus.diploma-recognition.ru";
const QUESTION = "Признают ли диплом Северного Кипра в Казахстане?";
const ANSWER =
  "Есть реальный риск отказа. В Правилах признания документов об образовании (приказ МОН РК № 352 от 19.07.2021) прямо названо основание для отказа — документы стран, которые Казахстан не признаёт субъектом международного права, а ТРСК Казахстан не признаёт. Правила могли обновиться, поэтому до поступления сделайте запрос в ENIC-Kazakhstan. Исключение — METU Northern Cyprus Campus: его выпускники получают диплом турецкого METU.";

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

  const params = new URLSearchParams({
    perspective: "raw",
    query: "*[_id == $id][0]{_id, _rev, contentBlocks}",
    $id: JSON.stringify(`drafts.${PAGE}`)
  });
  const { result: doc } = await api(`query/${DATASET}?${params}`);
  if (!doc) throw new Error(`черновик ${PAGE} не найден`);

  const blocks = doc.contentBlocks || [];
  const index = blocks.findIndex(block => block._type === "accordionBlock");
  if (index < 0) throw new Error("на странице нет FAQ");

  const faq = blocks[index];
  if ((faq.items || []).some(item => item.question === QUESTION)) {
    console.log(`${PAGE}: вопрос уже есть`);
    return;
  }

  const next = [...blocks];
  next[index] = {
    ...faq,
    items: [
      ...(faq.items || []),
      {
        _key: key(),
        question: QUESTION,
        answer: markdownToPortableText(ANSWER)
      }
    ]
  };
  console.log(`${PAGE}: FAQ, вопрос ${next[index].items.length}`);

  if (!APPLY) {
    console.log("\nСухой прогон. Для записи: --apply");
    return;
  }

  await api(`mutate/${DATASET}`, {
    mutations: [
      {
        patch: {
          id: doc._id,
          ifRevisionID: doc._rev,
          set: { contentBlocks: next }
        }
      }
    ]
  });
  console.log("Записано");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
