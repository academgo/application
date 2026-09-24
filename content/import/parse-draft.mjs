import fs from "node:fs";
import {
  key,
  markdownToPortableText,
  markdownToPlainText
} from "./markdown-to-portable-text.mjs";

/** Frontmatter: простые пары key: value и массивы [a, b] */
const parseFrontmatter = text => {
  const data = {};

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const match = line.match(/^([a-z0-9_]+):\s*(.*)$/i);
    if (!match) continue;

    const [, name, rawValue] = match;
    let value = rawValue.trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map(item => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }

    data[name] = value;
  }

  return data;
};

const parseMarkerAttributes = marker => {
  const attributes = {};
  const re = /([a-z]+)="([^"]*)"/gi;
  let match;

  while ((match = re.exec(marker)) !== null) {
    attributes[match[1]] = match[2];
  }

  return attributes;
};

const buildTableBlock = body => {
  const rows = body
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("|"));

  if (rows.length < 2) return null;

  const cells = row =>
    row
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map(cell => cell.trim());

  const columns = cells(rows[0]);
  const bodyRows = rows.slice(2); // строка-разделитель пропускается

  return {
    _type: "tableBlock",
    _key: key(),
    marginTop: "small",
    marginBottom: "medium",
    columns,
    rows: bodyRows.map(row => ({
      _type: "tableRow",
      _key: key(),
      cells: cells(row).map(cell => ({
        _type: "blockContentWithStyle",
        _key: key(),
        content: markdownToPortableText(cell)
      }))
    }))
  };
};

/**
 * Маркированный список. Блок bulletsBlock на сайте — это крупные цифры со
 * подписями, для обычного списка он не годится, поэтому список едет обычным
 * текстовым блоком: заголовок + маркированный список.
 */
const buildBulletsBlock = (body, attributes) => {
  const bullets = body
    .split("\n")
    .map(line => line.trim())
    .filter(line => /^[-*]\s+/.test(line));

  if (!bullets.length) return null;

  const markdown = [
    attributes.title ? `### ${attributes.title}` : "",
    bullets.join("\n")
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    _type: "textContent",
    _key: key(),
    marginBottom: "small",
    content: markdownToPortableText(markdown)
  };
};

const buildProcessBlock = (body, attributes) => {
  const items = [];
  let current = null;

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);

    if (numbered) {
      if (current) items.push(current);
      current = { number: numbered[1], text: [numbered[2]] };
      continue;
    }

    if (line && current) current.text.push(line);
  }

  if (current) items.push(current);
  if (!items.length) return null;

  return {
    _type: "processBlock",
    _key: key(),
    ...(attributes.title ? { title: attributes.title } : {}),
    items: items.map(item => ({
      _key: key(),
      number: item.number,
      content: {
        _type: "blockContentWithStyle",
        content: markdownToPortableText(item.text.join("\n"))
      }
    }))
  };
};

const buildAccordionBlock = (body, attributes) => {
  const items = [];
  let current = null;

  for (const rawLine of body.split("\n")) {
    const heading = rawLine.trim().match(/^#{3,4}\s+(.*)$/);

    if (heading) {
      if (current) items.push(current);
      current = { question: heading[1], answer: [] };
      continue;
    }

    if (current) current.answer.push(rawLine);
  }

  if (current) items.push(current);
  if (!items.length) return null;

  return {
    _type: "accordionBlock",
    _key: key(),
    ...(attributes.title ? { title: attributes.title } : {}),
    items: items.map(item => ({
      _key: key(),
      question: item.question,
      answer: markdownToPortableText(item.answer.join("\n"))
    }))
  };
};

/**
 * draft.md → { frontmatter, contentBlocks, videoPlan, editorNotes }
 * Маркеры вида <!-- block: type attr="..." --> разбивают тело на блоки,
 * <!-- editor-notes --> закрывает содержательную часть.
 */
export const parseDraft = (filePath, { quizRef, surveyTitle } = {}) => {
  const raw = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    throw new Error(`Нет frontmatter: ${filePath}`);
  }

  const frontmatter = parseFrontmatter(frontmatterMatch[1]);
  const afterFrontmatter = raw.slice(frontmatterMatch[0].length);

  const notesIndex = afterFrontmatter.indexOf("<!-- editor-notes -->");
  const body =
    notesIndex === -1
      ? afterFrontmatter
      : afterFrontmatter.slice(0, notesIndex);
  const editorNotes =
    notesIndex === -1
      ? ""
      : afterFrontmatter
          .slice(notesIndex + "<!-- editor-notes -->".length)
          .trim();

  const parts = body.split(/<!--\s*block:\s*([^>]*?)\s*-->/g);
  const contentBlocks = [];
  const videoPlan = [];
  const warnings = [];

  for (let i = 1; i < parts.length; i += 2) {
    const marker = parts[i];
    const content = (parts[i + 1] || "").trim();
    const type = marker.split(/\s+/)[0];
    const attributes = parseMarkerAttributes(marker);

    switch (type) {
      case "textContent":
      case "cta": {
        if (!content) break;
        contentBlocks.push({
          _type: "textContent",
          _key: key(),
          content: markdownToPortableText(content),
          marginBottom: type === "cta" ? "large" : "small"
        });
        break;
      }
      case "tableBlock": {
        const table = buildTableBlock(content);
        if (table) contentBlocks.push(table);
        else warnings.push(`Пустая таблица в ${filePath}`);
        break;
      }
      case "bulletsBlock": {
        const bullets = buildBulletsBlock(content, attributes);
        if (bullets) contentBlocks.push(bullets);
        else warnings.push(`Пустой список в ${filePath}`);
        break;
      }
      case "processBlock": {
        const process = buildProcessBlock(content, attributes);
        if (process) contentBlocks.push(process);
        else warnings.push(`Пустой processBlock в ${filePath}`);
        break;
      }
      case "accordionBlock": {
        const accordion = buildAccordionBlock(content, attributes);
        if (accordion) contentBlocks.push(accordion);
        else warnings.push(`Пустой accordionBlock в ${filePath}`);
        break;
      }
      case "surveyBlock": {
        contentBlocks.push({
          _type: "surveyBlock",
          _key: key(),
          survey: {
            _type: "object",
            title: attributes.title || surveyTitle || "",
            // вопросы лежат в общем документе Quiz, а не копией на каждой странице
            ...(quizRef ? { quizDocument: quizRef } : {})
          }
        });
        break;
      }
      case "video": {
        videoPlan.push({
          _key: key(),
          slot: attributes.slot || "",
          duration: attributes.duration || "",
          brief: content
        });
        break;
      }
      default: {
        warnings.push(`Неизвестный блок "${type}" в ${filePath}`);
      }
    }
  }

  return { frontmatter, contentBlocks, videoPlan, editorNotes, warnings };
};
