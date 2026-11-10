// schemaTypes/quizBlock.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "quizBlock",
  title: "Quiz Block",
  type: "object",
  groups: [
    { name: "questions", title: "Вопросы", default: true },
    { name: "final", title: "Финальный экран" }
  ],
  fields: [
    defineField({
      name: "questions",
      title: "Вопросы квиза",
      type: "array",
      of: [{ type: "quizQuestion" }],
      group: "questions",
      validation: Rule => Rule.min(1).error("Add at least 1 question"),
      description:
        "Порядок вопросов здесь — порядок шагов в квизе. Первый вопрос больше не зашит в код: " +
        "его тоже можно менять и переставлять."
    }),

    defineField({
      name: "finalEyebrow",
      title: "Надзаголовок",
      type: "string",
      group: "final",
      description: "Мелкая строка над заголовком, например «Анкета заполнена»"
    }),

    defineField({
      name: "finalTitle",
      title: "Заголовок",
      type: "string",
      group: "final"
    }),

    defineField({
      name: "finalDescription",
      title: "Описание",
      type: "text",
      rows: 3,
      group: "final",
      description:
        "Абзац под заголовком: что человек получит, написав в мессенджер"
    }),

    defineField({
      name: "finalMode",
      title: "Какие кнопки показывать",
      type: "string",
      group: "final",
      initialValue: "telegram",
      options: {
        list: [
          { title: "Одна кнопка — Telegram", value: "telegram" },
          { title: "Одна кнопка — WhatsApp", value: "whatsapp" },
          { title: "Две кнопки — Telegram и WhatsApp", value: "both" }
        ],
        layout: "radio"
      }
    }),

    defineField({
      name: "telegramLabel",
      title: "Подпись кнопки Telegram",
      type: "string",
      group: "final",
      hidden: ({ parent }: any) => parent?.finalMode === "whatsapp"
    }),

    defineField({
      name: "telegramLink",
      title: "Ссылка на Telegram",
      type: "url",
      group: "final",
      hidden: ({ parent }: any) => parent?.finalMode === "whatsapp",
      description:
        "Если оставить пустым, берётся ссылка на Telegram из контактов футера.",
      validation: Rule => Rule.uri({ scheme: ["http", "https"] })
    }),

    defineField({
      name: "whatsappLabel",
      title: "Подпись кнопки WhatsApp",
      type: "string",
      group: "final",
      hidden: ({ parent }: any) => parent?.finalMode === "telegram"
    }),

    defineField({
      name: "whatsappLink",
      title: "Ссылка на WhatsApp",
      type: "url",
      group: "final",
      hidden: ({ parent }: any) => parent?.finalMode === "telegram",
      description:
        "Если оставить пустым, берётся ссылка на WhatsApp из контактов футера.",
      validation: Rule => Rule.uri({ scheme: ["http", "https"] })
    }),

    defineField({
      name: "finalNote",
      title: "Примечание под кнопкой",
      type: "string",
      group: "final",
      description: "Мелкая строка, например «Ответим в течение рабочего дня»"
    }),

    defineField({
      name: "showSocials",
      title: "Показывать иконки соцсетей под кнопкой",
      type: "boolean",
      group: "final",
      initialValue: true,
      description: "Иконки и ссылки берутся из контактов футера"
    })
  ]
});
