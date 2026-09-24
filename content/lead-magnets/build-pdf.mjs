/**
 * Сборка PDF лид-магнитов из markdown.
 *
 *   node content/lead-magnets/build-pdf.mjs            # все файлы
 *   node content/lead-magnets/build-pdf.mjs documents  # один магнит
 *
 * Markdown → HTML по фирменному макету → печать через headless Chrome.
 * Результат: content/lead-magnets/out/<magnet>-<lang>.pdf
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "out");

const LOGO =
  "https://cdn.sanity.io/images/19hn716s/production/8045a404151f6af68d6964abcda08bd5c5e78946-1159x231.png";

const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

const only = process.argv[2];

// ------------------------------------------------------------------ markdown

const escapeHtml = value =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const inline = text =>
  escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

const parseFrontmatter = raw => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  match[1].split("\n").forEach(line => {
    const pair = line.match(/^([a-z0-9_]+):\s*(.*)$/i);
    if (pair) data[pair[1]] = pair[2].replace(/^["']|["']$/g, "").trim();
  });

  return { data, body: raw.slice(match[0].length) };
};

const tableRow = line =>
  line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(cell => cell.trim());

const markdownToHtml = markdown => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];

  let paragraph = [];
  let list = null;
  let table = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    html.push(`<ul>${list.map(item => `<li>${inline(item)}</li>`).join("")}</ul>`);
    list = null;
  };

  const flushTable = () => {
    if (!table) return;

    const [head, ...rows] = table;
    html.push(
      `<table><thead><tr>${head
        .map(cell => `<th>${inline(cell)}</th>`)
        .join("")}</tr></thead><tbody>${rows
        .map(
          row =>
            `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join("")}</tr>`
        )
        .join("")}</tbody></table>`
    );
    table = null;
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      continue;
    }

    if (line.startsWith("|")) {
      flushParagraph();
      flushList();

      const cells = tableRow(line);
      if (cells.every(cell => /^-{2,}$/.test(cell.replace(/\s/g, "")))) continue;

      table = table || [];
      table.push(cells);
      continue;
    }

    flushTable();

    if (line === "---") {
      flushAll();
      html.push('<hr class="divider"/>');
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      list = list || [];
      list.push(bullet[1]);
      continue;
    }

    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      flushParagraph();
      list = list || [];
      list.push(numbered[2]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushAll();

  return html.join("\n");
};

// ------------------------------------------------------------------- макет

const page = ({ data, content }) => `<!DOCTYPE html>
<html lang="${data.lang || "ru"}">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(data.title || "AcademGo")}</title>
<style>
  @page { size: A4; margin: 18mm 16mm 20mm; }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    line-height: 1.5;
    color: #091728;
  }

  .cover {
    background: linear-gradient(135deg, #112546 0%, #1b3760 60%, #24508f 100%);
    color: #fff;
    padding: 22mm 14mm;
    border-radius: 6mm;
    margin-bottom: 10mm;
  }

  .cover img { height: 11mm; margin-bottom: 12mm; }
  .cover h1 { font-size: 22pt; line-height: 1.15; margin: 0 0 6mm; color: #fff; }
  .cover .subtitle { font-size: 12pt; color: rgba(255,255,255,0.85); margin: 0 0 8mm; }
  .cover .meta { font-size: 9.5pt; color: rgba(255,255,255,0.7); }

  h1 { font-size: 17pt; margin: 0 0 4mm; }
  h2 {
    font-size: 14pt;
    margin: 9mm 0 3mm;
    padding-top: 3mm;
    border-top: 0.6mm solid #f39708;
    page-break-after: avoid;
  }
  h3 { font-size: 11.5pt; margin: 6mm 0 2mm; page-break-after: avoid; }

  p { margin: 0 0 3mm; }

  ul { margin: 0 0 4mm; padding-left: 5mm; }
  li { margin-bottom: 1.5mm; }
  li::marker { color: #f39708; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 5mm;
    font-size: 9pt;
    page-break-inside: avoid;
  }
  th {
    background: #112546;
    color: #fff;
    text-align: left;
    padding: 2mm 2.5mm;
    font-weight: 600;
  }
  td {
    border-bottom: 0.2mm solid #dde3ec;
    padding: 2mm 2.5mm;
    vertical-align: top;
  }
  tr:nth-child(even) td { background: #f5f7fa; }

  a { color: #1b3760; }
  code { font-family: inherit; }

  .divider { border: 0; border-top: 0.3mm solid #dde3ec; margin: 6mm 0; }

  .cta {
    margin-top: 8mm;
    padding: 6mm;
    border-radius: 4mm;
    background: #f5f7fa;
    border-left: 1.5mm solid #f39708;
    page-break-inside: avoid;
  }
  .cta p { margin: 0; }

  .footer {
    margin-top: 8mm;
    padding-top: 3mm;
    border-top: 0.2mm solid #dde3ec;
    font-size: 8.5pt;
    color: #6b7789;
  }
</style>
</head>
<body>
  <section class="cover">
    <img src="${LOGO}" alt="AcademGo"/>
    <h1>${escapeHtml(data.title || "")}</h1>
    ${data.subtitle ? `<p class="subtitle">${escapeHtml(data.subtitle)}</p>` : ""}
    <p class="meta">academgo.com · ${
      data.lang === "en"
        ? "Warsaw, ul. Z\u0142ota 7/28"
        : "\u0412\u0430\u0440\u0448\u0430\u0432\u0430, ul. Z\u0142ota 7/28"
    }</p>
  </section>

  ${content}

  ${
    data.cta
      ? `<div class="cta"><p>${escapeHtml(data.cta)}</p></div>`
      : ""
  }

  <div class="footer">${
    data.lang === "en"
      ? "AcademGo \u2014 study abroad consultancy. All figures come from official university and government sources; check the year of the price list before you pay."
      : "AcademGo \u2014 \u0430\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e \u043f\u043e \u043f\u043e\u0441\u0442\u0443\u043f\u043b\u0435\u043d\u0438\u044e \u0437\u0430 \u0440\u0443\u0431\u0435\u0436\u043e\u043c. \u0412\u0441\u0435 \u0446\u0438\u0444\u0440\u044b \u2014 \u0438\u0437 \u043e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0445 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u043e\u0432 \u0432\u0443\u0437\u043e\u0432 \u0438 \u0432\u0435\u0434\u043e\u043c\u0441\u0442\u0432; \u043f\u0435\u0440\u0435\u0434 \u043e\u043f\u043b\u0430\u0442\u043e\u0439 \u0441\u0432\u0435\u0440\u044f\u0439\u0442\u0435 \u0433\u043e\u0434 \u043f\u0440\u0430\u0439\u0441-\u043b\u0438\u0441\u0442\u0430."
  }</div>
</body>
</html>`;

// ------------------------------------------------------------------- печать

const chrome = () => {
  const found = CHROME_PATHS.find(item => fs.existsSync(item));
  if (!found) throw new Error("Не найден Chrome или Edge для печати PDF");
  return found;
};

const printPdf = (htmlPath, pdfPath) => {
  execFileSync(
    chrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      `file:///${htmlPath.replace(/\\/g, "/")}`
    ],
    { stdio: "ignore", timeout: 120000 }
  );
};

// --------------------------------------------------------------------- main

const main = () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(__dirname)
    .filter(name => name.endsWith(".md") && name !== "README.md")
    .filter(name => !only || name.startsWith(only));

  if (!files.length) {
    console.error("Не найдено ни одного markdown-файла");
    process.exit(1);
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(__dirname, file), "utf8");
    const { data, body } = parseFrontmatter(raw);

    // заголовок и подзаголовок уже на обложке — из текста убираем
    const withoutTitle = body.replace(/^#\s+.*$/m, "");

    const html = page({ data, content: markdownToHtml(withoutTitle) });
    const base = file.replace(/\.md$/, "");
    const htmlPath = path.join(OUT_DIR, `${base}.html`);
    const pdfPath = path.join(OUT_DIR, `${base}.pdf`);

    fs.writeFileSync(htmlPath, html);
    printPdf(htmlPath, pdfPath);

    const size = (fs.statSync(pdfPath).size / 1024).toFixed(0);
    console.log(`${base}.pdf — ${size} КБ`);
  }

  console.log(`\nГотово: ${OUT_DIR}`);
};

main();
