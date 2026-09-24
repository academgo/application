import { defineField } from "sanity";

const university = {
  name: "university",
  title: "University",
  type: "document",
  description:
    "Университет. Нужен для карточек вузов, блоков «Похожие университеты» и списков на страницах стран.",
  fields: [
    defineField({
      name: "title",
      title: "University name",
      type: "string",
      description: "Официальное название, как его ищут: Istanbul Medipol University"
    }),
    defineField({
      name: "titleLocal",
      title: "Name in the page language",
      type: "string",
      description: "Русское написание, если есть: «Медипол». Для EN можно не заполнять"
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "reference",
      to: [{ type: "country" }],
      validation: Rule => Rule.required()
    }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Государственный / Public", value: "public" },
          { title: "Частный / Private", value: "private" },
          { title: "Филиал зарубежного вуза / Branch campus", value: "branch" }
        ]
      }
    }),
    defineField({
      name: "page",
      title: "University page",
      type: "reference",
      to: [{ type: "subpage" }],
      description: "Карточка вуза на сайте"
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image"
    }),
    defineField({
      name: "tuitionFrom",
      title: "Tuition from",
      type: "string",
      description: "Диапазон с годом прайса: «от $5 000 в год (2026/27)»"
    }),
    defineField({
      name: "programsLanguage",
      title: "Language of programmes",
      type: "string",
      description: "Например: «английский; часть программ на турецком»"
    }),
    defineField({
      name: "highlight",
      title: "Highlight",
      type: "string",
      description: "1 предложение: чем вуз интересен абитуриенту"
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number"
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ],
  preview: {
    select: { title: "title", subtitle: "city", media: "logo" }
  }
};

export default university;
