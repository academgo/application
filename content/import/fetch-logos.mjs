/**
 * Собирает логотипы вузов с их официальных сайтов.
 *
 *   node content/import/fetch-logos.mjs           # скачать в content/logos
 *   node content/import/fetch-logos.mjs --upload  # + загрузить в Sanity
 *
 * Домены берём из наших сводок фактов (content/facts): там для каждого вуза
 * собраны ссылки на официальные страницы, самый частый домен — сайт вуза.
 *
 * Источник логотипа по убыванию качества:
 *   1) apple-touch-icon сайта (обычно 180–512 px);
 *   2) картинка с «logo» в пути из шапки страницы;
 *   3) favicon 256 px через сервис Google.
 * SVG отрисовываем в PNG через headless Chrome, мелкие иконки отбрасываем —
 * вместо них в карточке остаётся заглушка с инициалами.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const FACTS = path.join(ROOT, "content/facts");
const OUT = path.join(ROOT, "content/logos");

const PROJECT_ID = "19hn716s";
const DATASET = "production";
const API_VERSION = "2023-05-03";

const UPLOAD = process.argv.includes("--upload");
// загрузить в Sanity то, что уже лежит в content/logos, ничего не скачивая:
// так сохраняется ручной отбор — пустые и обрезанные логотипы можно удалить
const UPLOAD_ONLY = process.argv.includes("--upload-only");
const MIN_SIZE = 64;

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
].find(item => fs.existsSync(item));

/** код страны в Sanity → префикс файлов сводок */
const FACT_PREFIX = {
  "north-cyprus": "ncyprus",
  "south-cyprus": "scyprus"
};

const IGNORED_DOMAINS =
  /wikipedia|wikimedia|numbeo|google|facebook|instagram|youtube|linkedin|twitter|gov\.|mfa\.|osym|yok\.gov|goc\.gov|mevzuat|studyin|timeshighereducation|topuniversities|nmc\.org/i;

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

const domainFromFacts = (country, name) => {
  const prefix = FACT_PREFIX[country] || country;
  const file = path.join(FACTS, `${prefix}-${name}.md`);

  if (!fs.existsSync(file)) return null;

  const counts = {};

  (fs.readFileSync(file, "utf8").match(/https?:\/\/[a-z0-9.-]+/gi) || []).forEach(
    url => {
      const domain = url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
      if (IGNORED_DOMAINS.test(domain)) return;
      counts[domain] = (counts[domain] || 0) + 1;
    }
  );

  const [top] = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!top) return null;

  // поддомены вида international.altinbas.edu.tr приводим к основному домену
  const parts = top[0].split(".");
  return parts.length > 3 ? parts.slice(-3).join(".") : top[0];
};

const sizeOf = buffer => {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    return { type: "png", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);

      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {
          type: "jpeg",
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        };
      }

      offset += 2 + length;
    }
    return { type: "jpeg", width: 0, height: 0 };
  }

  if (buffer.slice(0, 200).toString().includes("<svg")) {
    return { type: "svg", width: 512, height: 512 };
  }

  return { type: "unknown", width: 0, height: 0 };
};

const download = async url => {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AcademGoSiteBot/1.0)" },
      signal: AbortSignal.timeout(20000)
    });

    if (!response.ok) return null;

    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
};

const absolute = (href, origin) => {
  if (!href) return null;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("http")) return href;
  return new URL(href, origin).href;
};

const candidates = async domain => {
  const origin = `https://${domain}`;
  const html = await download(origin);
  const list = [];

  if (html) {
    const page = html.toString("utf8");

    const apple = page.match(
      /<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]*>/gi
    );

    (apple || []).forEach(tag => {
      const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
      const url = absolute(href, origin);
      if (url) list.push(url);
    });

    const logos = page.match(/<img[^>]+src=["']([^"']*logo[^"']*)["'][^>]*>/gi);

    (logos || []).slice(0, 3).forEach(tag => {
      const href = tag.match(/src=["']([^"']+)["']/i)?.[1];
      const url = absolute(href, origin);
      if (url) list.push(url);
    });
  }

  list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);

  return list;
};

const svgToPng = (svgPath, pngPath) => {
  if (!CHROME) return false;

  const html = `<!DOCTYPE html><html><body style="margin:0;background:#fff">
    <img src="file:///${svgPath.replace(/\\/g, "/")}" style="width:256px;height:256px;object-fit:contain"/>
  </body></html>`;

  const htmlPath = `${svgPath}.html`;
  fs.writeFileSync(htmlPath, html);

  try {
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=256,256",
        `--screenshot=${pngPath}`,
        `file:///${htmlPath.replace(/\\/g, "/")}`
      ],
      { stdio: "ignore", timeout: 60000 }
    );

    return fs.existsSync(pngPath);
  } catch {
    return false;
  } finally {
    fs.rmSync(htmlPath, { force: true });
  }
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
  fs.mkdirSync(OUT, { recursive: true });

  const { result: universities } = await request(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
      '*[_type == "university"]{_id, title, language, "code": country->code, "hasLogo": defined(logo)}'
    )}&perspective=drafts`
  );

  // по одному вузу на страну и код: документы ru и en описывают один и тот же вуз
  const unique = new Map();

  universities.forEach(university => {
    const name = university._id
      .replace(/^drafts\./, "")
      .split(".")
      .slice(3, -1)
      .join(".");

    const key = `${university.code}/${name}`;
    if (!unique.has(key)) {
      unique.set(key, { ...university, name, key });
    }
  });

  const results = [];

  for (const [key, university] of unique) {
    // режим «только загрузка»: берём файл с диска, если он есть
    if (UPLOAD_ONLY) {
      const existing = ["png", "jpg"]
        .map(ext => path.join(OUT, `${university.code}-${university.name}.${ext}`))
        .find(file => fs.existsSync(file));

      if (existing) {
        results.push({ key, path: existing, university });
      } else {
        console.log(`${key.padEnd(30)} файла нет — останется заглушка`);
        results.push({ key, status: "нет файла", university });
      }

      continue;
    }

    const domain = domainFromFacts(university.code, university.name);

    if (!domain) {
      console.log(`${key.padEnd(30)} домен не найден в сводках`);
      results.push({ key, status: "нет домена" });
      continue;
    }

    let saved = null;

    for (const url of await candidates(domain)) {
      const buffer = await download(url);
      if (!buffer || buffer.length < 200) continue;

      const info = sizeOf(buffer);
      const file = path.join(OUT, `${university.code}-${university.name}`);

      if (info.type === "svg") {
        const svgPath = `${file}.svg`;
        fs.writeFileSync(svgPath, buffer);

        if (svgToPng(svgPath, `${file}.png`)) {
          fs.rmSync(svgPath, { force: true });
          saved = { path: `${file}.png`, source: url, size: "256x256 (из SVG)" };
          break;
        }

        fs.rmSync(svgPath, { force: true });
        continue;
      }

      if (info.width < MIN_SIZE || info.height < MIN_SIZE) continue;

      const target = `${file}.${info.type === "jpeg" ? "jpg" : "png"}`;
      fs.writeFileSync(target, buffer);
      saved = { path: target, source: url, size: `${info.width}x${info.height}` };
      break;
    }

    if (saved) {
      console.log(`${key.padEnd(30)} ${saved.size.padEnd(16)} ${domain}`);
      results.push({ key, ...saved, domain, university });
    } else {
      console.log(`${key.padEnd(30)} подходящего логотипа нет (${domain})`);
      results.push({ key, status: "нет логотипа", domain });
    }
  }

  const found = results.filter(item => item.path);
  console.log(`\nНайдено логотипов: ${found.length} из ${unique.size}`);

  if (!UPLOAD && !UPLOAD_ONLY) {
    console.log("Файлы в content/logos. Для загрузки в Sanity добавьте --upload");
    return;
  }

  const mutations = [];

  // у вузов без файла логотип снимаем: в карточке снова будут инициалы
  results
    .filter(item => !item.path && item.university)
    .forEach(item => {
      universities
        .filter(
          university =>
            university.code === item.university.code &&
            university._id.includes(`.${item.university.name}.`)
        )
        .forEach(university => {
          mutations.push({
            patch: {
              id: university._id.startsWith("drafts.")
                ? university._id
                : `drafts.${university._id}`,
              unset: ["logo"]
            }
          });
        });
    });

  for (const item of found) {
    const isPng = item.path.endsWith(".png");

    const { document } = await request(
      `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=logo-${path.basename(
        item.path
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": isPng ? "image/png" : "image/jpeg" },
        body: fs.readFileSync(item.path)
      }
    );

    // логотип ставим в обе языковые версии документа вуза
    universities
      .filter(
        university =>
          university.code === item.university.code &&
          university._id.includes(`.${item.university.name}.`)
      )
      .forEach(university => {
        mutations.push({
          patch: {
            id: university._id.startsWith("drafts.")
              ? university._id
              : `drafts.${university._id}`,
            set: {
              logo: {
                _type: "image",
                asset: { _type: "reference", _ref: document._id }
              }
            }
          }
        });
      });
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
  }

  console.log(`Логотипы проставлены в ${mutations.length} документах.`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
