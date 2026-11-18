import { defineField } from "sanity";

const ctaDocument = {
  name: "ctaDocument",
  title: "Messenger card",
  type: "document",
  description:
    "Card with a messenger button — the same one as on the final quiz screen. " +
    "One document per language: edit it here and it changes on every page that uses it.",
  fields: [
    defineField({
      name: "title",
      title: "Name for the list",
      type: "string",
      description: "Admin only, for example «Плашка после квиза, RU»",
      validation: Rule => Rule.required()
    }),

    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small line above the heading"
    }),

    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "The country of the page can be inserted: {country} gives «Венгрия», {countryIn} gives «в Венгрию»"
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "The country placeholders work here too: {country} and {countryIn}"
    }),

    defineField({
      name: "mode",
      title: "Which buttons to show",
      type: "string",
      initialValue: "both",
      options: {
        list: [
          { title: "One button — Telegram", value: "telegram" },
          { title: "One button — WhatsApp", value: "whatsapp" },
          { title: "Two buttons — Telegram and WhatsApp", value: "both" }
        ],
        layout: "radio"
      }
    }),

    defineField({
      name: "telegramLabel",
      title: "Telegram button label",
      type: "string",
      hidden: ({ parent }: any) => parent?.mode === "whatsapp"
    }),

    defineField({
      name: "telegramLink",
      title: "Telegram link",
      type: "url",
      hidden: ({ parent }: any) => parent?.mode === "whatsapp",
      validation: Rule => Rule.uri({ scheme: ["http", "https"] })
    }),

    defineField({
      name: "whatsappLabel",
      title: "WhatsApp button label",
      type: "string",
      hidden: ({ parent }: any) => parent?.mode === "telegram"
    }),

    defineField({
      name: "whatsappLink",
      title: "WhatsApp link",
      type: "url",
      hidden: ({ parent }: any) => parent?.mode === "telegram",
      description: "Empty — the WhatsApp link from the footer contacts is used",
      validation: Rule => Rule.uri({ scheme: ["http", "https"] })
    }),

    defineField({
      name: "note",
      title: "Note under the button",
      type: "string"
    }),

    defineField({
      name: "showSocials",
      title: "Show social icons under the button",
      type: "boolean",
      initialValue: true,
      description: "Icons and links are taken from the footer contacts"
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
