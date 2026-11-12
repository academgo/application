import { defineField } from "sanity";

const ctaDocument = {
  name: "ctaDocument",
  title: "Плашка в мессенджер",
  type: "document",
  description:
    "Плашка с кнопкой в мессенджер — та же, что на финальном экране квиза. " +
    "Один документ на язык: меняете здесь — меняется на всех страницах, где стоит этот блок.",
  fields: [
    defineField({
      name: "title",
      title: "Название для списка",
      type: "string",
      description: "Видно только в админке, например «Плашка после квиза, RU»",
      validation: Rule => Rule.required()
    }),

    defineField({
      name: "eyebrow",
      title: "Надзаголовок",
      type: "string",
      description: "Мелкая строка над заголовком"
    }),

    defineField({
      name: "heading",
      title: "Заголовок",
      type: "string",
      description:
        "Можно подставить страну страницы: {country} даёт «Венгрия», {countryIn} — «в Венгрию»"
    }),

    defineField({
      name: "description",
      title: "Описание",
      type: "text",
      rows: 3,
      description:
        "Подстановка страны работает и здесь: {country} и {countryIn}"
    }),

    defineField({
      name: "mode",
      title: "Какие кнопки показывать",
      type: "string",
      initialValue: "both",
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
      hidden: ({ parent }: any) => parent?.mode === "whatsapp"
    }),

    defineField({
      name: "telegramLink",
      title: "Ссылка на Telegram",
      type: "url",
      hidden: ({ parent }: any) => parent?.mode === "whatsapp",
      validation: Rule => Rule.uri({ scheme: ["http", "https"] })
    }),

    defineField({
      name: "whatsappLabel",
      title: "Подпись кнопки WhatsApp",
      type: "string",
      hidden: ({ parent }: any) => parent?.mode === "telegram"
    }),

    defineField({
      name: "whatsappLink",
      title: "Ссылка на WhatsApp",
      type: "url",
      hidden: ({ parent }: any) => parent?.mode === "telegram",
      description: "Если пусто, берётся ссылка на WhatsApp из контактов футера",
      validation: Rule => Rule.uri({ scheme: ["http", "https"] })
    }),

    defineField({
      name: "note",
      title: "Примечание под кнопкой",
      type: "string"
    }),

    defineField({
      name: "showSocials",
      title: "Показывать иконки соцсетей под кнопкой",
      type: "boolean",
      initialValue: true,
      description: "Иконки и ссылки берутся из контактов футера"
    }),

    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ],
  preview: {
    select: { title: "title", subtitle: "language" }
  }
};

export default ctaDocument;
