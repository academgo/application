# Загрузка страниц в Sanity

Скрипт превращает 180 готовых страниц из `content/drafts` в документы Sanity:
хабы стран (`singlepage`), тематические страницы и карточки вузов (`subpage`),
а также справочники `country` и `university` и связи языковых версий
(`translation.metadata`).

## Как запускать

```bash
# сухой прогон: собирает documents.ndjson и показывает, что получится
node content/import/import-to-sanity.mjs

# только одна страна
node content/import/import-to-sanity.mjs --only turkey

# загрузка черновиками (на живом сайте не видны)
node content/import/import-to-sanity.mjs --apply

# загрузка сразу опубликованными версиями
node content/import/import-to-sanity.mjs --apply --publish
```

Токен: `SANITY_API_WRITE_TOKEN` в `.env.local`, права Editor
(Sanity → Manage → API → Tokens).

## Как устроены документы

- **ID детерминированные:** `academgo.<страна>.<страница>.<язык>`, у черновиков
  добавляется префикс `drafts.`. Повторный запуск перезаписывает те же
  документы, дублей не появляется.
- **Ссылки между документами слабые** (`_weak: true`) и всегда указывают на
  опубликованный ID. Пока страницы лежат черновиками, ссылки резолвятся на
  preview-деплое (`perspective: previewDrafts`), а после публикации — на живом
  сайте.
- **Блоки** собираются из маркеров в `draft.md`:
  `textContent`, `tableBlock`, `bulletsBlock`, `processBlock`,
  `accordionBlock`, `surveyBlock`, `cta` → `textContent`.
- **Слоты под видео** (`<!-- block: video ... -->`) не попадают в контент
  страницы: они складываются в поле **Video plan** документа — это план съёмок.
  После съёмки видео добавляется обычным блоком Videos Block.
- **Editor notes** из драфтов в Sanity не переносятся: они остаются в
  `content/drafts/**/draft.md` как рабочие пометки.

## Что заполняется вручную после импорта

1. `country`: флаг, короткое описание для главной, порядок в меню.
2. `university`: город, тип (государственный/частный/филиал), логотип, цена,
   язык программ, короткое описание.
3. `surveyBlock` на страницах: выбрать квиз (`quizBlock`) — сейчас блок
   создаётся с заголовком, но без вопросов.
4. Обложки страниц (`coverBlock.coverImage`).
5. Лид-магниты: блок Lead magnet, PDF-файл и обложка
   (тексты — в `content/lead-magnets`).

## Предпросмотр до публикации

1. Ветка `feature/multi-country` разворачивается на Vercel как preview.
2. В переменных окружения preview: `SANITY_API_READ_TOKEN` (права Viewer).
3. Preview читает черновики, редиректы на основной домен на нём отключены,
   `robots.txt` закрывает preview от индексации.
