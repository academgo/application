import { defineType, defineField } from "sanity";

export default defineType({
  name: "countryUniversitiesBlock",
  title: "Universities of the country",
  type: "object",
  description:
    "Карточки университетов страны. Список формируется автоматически из раздела University.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2
    }),
    defineField({
      name: "countryCode",
      title: "Country code",
      type: "string",
      description:
        "Оставьте пустым — возьмётся страна этой страницы. Заполните (turkey, uae, …), чтобы показать вузы другой страны."
    }),
    defineField({
      name: "excludeCurrentPage",
      title: "Hide the university of this page",
      type: "boolean",
      initialValue: true,
      description: "Для блока «Похожие университеты» на карточке вуза"
    }),
    defineField({
      name: "linkLabel",
      title: "Link label",
      type: "string",
      description: "Текст ссылки в карточке: «О вузе» / «About the university»"
    })
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }: { title?: string }) => ({
      title: title || "Университеты страны",
      subtitle: "Universities of the country"
    })
  }
});
