import { defineType, defineField } from "sanity";

export default defineType({
  name: "consultationFormBlock",
  title: "Consultation form",
  type: "object",
  description:
    "Баннер с короткой формой заявки (имя и телефон) и ссылками на мессенджеры.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "titleHighlight",
      title: "Title highlight",
      type: "string",
      description: "Продолжение заголовка, выделяется оранжевым"
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3
    }),
    defineField({ name: "formTitle", title: "Form title", type: "string" }),
    defineField({
      name: "nameLabel",
      title: "Name label",
      type: "string",
      initialValue: "Имя"
    }),
    defineField({
      name: "phoneLabel",
      title: "Phone label",
      type: "string",
      initialValue: "Телефон или WhatsApp"
    }),
    defineField({ name: "buttonText", title: "Button text", type: "string" }),
    defineField({
      name: "successText",
      title: "Success text",
      type: "string",
      description: "Сообщение после отправки заявки"
    }),
    defineField({ name: "errorText", title: "Error text", type: "string" }),
    defineField({
      name: "altText",
      title: "Messengers text",
      type: "string",
      description: "Подпись у кнопок мессенджеров: «или напишите нам»"
    }),
    defineField({
      name: "contactLinks",
      title: "Contact links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "image" }),
            defineField({ name: "link", title: "Link", type: "string" })
          ],
          preview: { select: { title: "title", media: "icon" } }
        }
      ]
    })
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }: { title?: string }) => ({
      title: title || "Форма консультации",
      subtitle: "Consultation form"
    })
  }
});
