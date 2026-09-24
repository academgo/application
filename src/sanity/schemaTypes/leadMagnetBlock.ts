import { defineType, defineField } from "sanity";

export default defineType({
  name: "leadMagnetBlock",
  title: "Lead magnet",
  type: "object",
  description:
    "Блок с бесплатным материалом: посетитель оставляет контакт и получает файл.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "bullets",
      title: "What is inside",
      type: "array",
      of: [{ type: "string" }],
      description: "3–5 пунктов: что человек получит"
    }),
    defineField({
      name: "coverImage",
      title: "Cover",
      type: "image"
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      description: "PDF, который скачивает пользователь"
    }),
    defineField({
      name: "magnetName",
      title: "Name for the lead email",
      type: "string",
      description:
        "Как материал будет называться в письме менеджеру: «Чек-лист документов, Турция»"
    }),
    defineField({
      name: "formTitle",
      title: "Form title",
      type: "string"
    }),
    defineField({
      name: "emailLabel",
      title: "Email label",
      type: "string",
      initialValue: "E-mail"
    }),
    defineField({
      name: "nameLabel",
      title: "Name label",
      type: "string",
      initialValue: "Имя"
    }),
    defineField({ name: "buttonText", title: "Button text", type: "string" }),
    defineField({
      name: "policyText",
      title: "Consent text",
      type: "string",
      description: "Текст рядом с галочкой согласия"
    }),
    defineField({
      name: "successText",
      title: "Success text",
      type: "string",
      description: "Сообщение после отправки, пока скачивается файл"
    }),
    defineField({
      name: "errorText",
      title: "Error text",
      type: "string"
    })
  ],
  preview: {
    select: { title: "title", media: "coverImage" },
    prepare: ({ title, media }: { title?: string; media?: any }) => ({
      title: title || "Лид-магнит",
      subtitle: "Lead magnet",
      media
    })
  }
});
