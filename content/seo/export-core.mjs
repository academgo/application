import fs from "node:fs";

const DR = "content/drafts";
const COUNTRY = {
  georgia: "Грузия", hungary: "Венгрия", italy: "Италия", malaysia: "Малайзия",
  "north-cyprus": "Северный Кипр", "south-cyprus": "Южный Кипр",
  spain: "Испания", turkey: "Турция", uae: "ОАЭ"
};
const TYPE = { topic: "Тематическая страница", "university-card": "Карточка вуза", "country-hub": "Хаб страны" };

const clean = s => (s || "").replace(/^["']|["']$/g, "").trim();
const field = (raw, name) => clean(raw.match(new RegExp("^" + name + ":\\s*(.*)$", "m"))?.[1]);

const pages = [];
for (const c of fs.readdirSync(DR)) {
  const dir = `${DR}/${c}`;
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    const file = `${dir}/${f}/draft.md`;
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    const secRaw = raw.match(/^secondary_keywords:\s*(.*)$/m)?.[1] || "";
    const secondary = secRaw.replace(/^\[|\]$/g, "").split(",").map(clean).filter(Boolean);
    pages.push({
      country: COUNTRY[c] || c,
      lang: field(raw, "lang") === "ru" ? "Русская" : "Английская",
      type: TYPE[field(raw, "page_type")] || field(raw, "page_type"),
      url: field(raw, "url"),
      title: field(raw, "meta_title"),
      h1: field(raw, "h1"),
      primary: field(raw, "primary_keyword"),
      secondary
    });
  }
}

const volumes = {};
for (const f of fs.readdirSync("content/keywords").filter(x => x.endsWith(".json"))) {
  const d = JSON.parse(fs.readFileSync("content/keywords/" + f, "utf8"));
  for (const [k, v] of Object.entries(d)) volumes[k.toLowerCase()] = v;
}

const month = JSON.parse(fs.readFileSync("content/seo/month-2026-10-30.json", "utf8"));
const positions = {};
month.pages.filter(r => r.position).forEach(r => {
  const key = r.keyword.toLowerCase();
  positions[key] = positions[key] || {};
  positions[key][r.market === "Казахстан" ? "kz" : "uz"] = r.position;
});

const NEWP = ["study-in-georgia","study-in-hungary","study-in-italy","study-in-malaysia","study-in-north-cyprus","study-in-cyprus","study-in-spain","study-in-turkey","study-in-uae","ucheba-v-","ucheba-na-","study-abroad","ucheba-za-rubezhom"];
const labs = [];
month.labs.forEach(m => m.items.filter(i => i.url && NEWP.some(k => i.url.includes(k)))
  .forEach(i => labs.push({ market: m.market.name, position: i.position, keyword: i.keyword, volume: i.volume, url: i.url })));

fs.writeFileSync("content/seo/core-export.json", JSON.stringify({ pages, volumes, positions, labs }, null, 1));
console.log("страниц:", pages.length, "| запросов с частотой:", Object.keys(volumes).length,
            "| запросов с позицией:", Object.keys(positions).length, "| строк Labs:", labs.length);
