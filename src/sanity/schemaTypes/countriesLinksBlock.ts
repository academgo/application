import { defineType, defineField } from "sanity";

export default defineType({
  name: "countriesLinksBlock",
  title: "Other countries",
  type: "object",
  description:
    "Блок «Другие страны»: ссылки на хабы всех стран. Список формируется автоматически из раздела Country.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2
    }),
    defineField({
      name: "excludeCurrent",
      title: "Hide the current country",
      type: "boolean",
      initialValue: true,
      description: "Не показывать страну, к которой относится эта страница"
    }),
    defineField({
      name: "showTuition",
      title: "Show tuition from",
      type: "boolean",
      initialValue: true
    })
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }: { title?: string }) => ({
      title: title || "Другие страны",
      subtitle: "Other countries"
    })
  }
});
