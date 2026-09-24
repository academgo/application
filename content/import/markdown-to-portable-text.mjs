import crypto from "node:crypto";

export const key = () => crypto.randomBytes(6).toString("hex");

/**
 * Разбор инлайновой разметки: **жирный**, *курсив*, [текст](ссылка).
 * Возвращает spans и markDefs для одного блока Portable Text.
 */
export const parseInline = text => {
  const spans = [];
  const markDefs = [];

  const pushSpan = (value, marks) => {
    if (!value) return;
    spans.push({ _type: "span", _key: key(), text: value, marks });
  };

  // Сначала разбираем ссылки, внутри них — жирный/курсив
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let lastIndex = 0;
  let match;

  const parseEmphasis = (value, extraMarks) => {
    const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
    let index = 0;
    let m;

    while ((m = re.exec(value)) !== null) {
      pushSpan(value.slice(index, m.index), extraMarks);
      if (m[2] !== undefined) {
        pushSpan(m[2], [...extraMarks, "strong"]);
      } else {
        pushSpan(m[4], [...extraMarks, "em"]);
      }
      index = m.index + m[0].length;
    }

    pushSpan(value.slice(index), extraMarks);
  };

  while ((match = linkRe.exec(text)) !== null) {
    parseEmphasis(text.slice(lastIndex, match.index), []);

    const markKey = key();
    markDefs.push({ _type: "link", _key: markKey, href: match[2] });
    parseEmphasis(match[1], [markKey]);

    lastIndex = match.index + match[0].length;
  }

  parseEmphasis(text.slice(lastIndex), []);

  if (!spans.length) {
    pushSpan("", []);
  }

  return { spans, markDefs };
};

const block = (style, text, listItem) => {
  const { spans, markDefs } = parseInline(text);

  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children: spans,
    ...(listItem ? { listItem: "bullet", level: 1 } : {})
  };
};

/**
 * Markdown (заголовки, абзацы, списки) → Portable Text (тип contentBlock).
 * Таблицы в markdown здесь не поддерживаются: они импортируются отдельным
 * блоком tableBlock.
 */
export const markdownToPortableText = markdown => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(block("normal", paragraph.join(" ").trim(), false));
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      blocks.push(block(`h${heading[1].length}`, heading[2], false));
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      blocks.push(block("normal", bullet[1], true));
      continue;
    }

    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (numbered) {
      flushParagraph();
      blocks.push(block("normal", numbered[1], true));
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push(block("blockquote", line.slice(2), false));
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();

  return blocks;
};

/** Плоский текст без markdown-разметки — для полей типа string */
export const markdownToPlainText = markdown =>
  markdown
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
