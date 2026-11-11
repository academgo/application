import { defineField } from "sanity";

const videoReviewsDocument = {
  name: "videoReviewsDocument",
  title: "Видеоотзывы",
  type: "document",
  description:
    "Слайдер с видеоотзывами. Один документ на язык: меняете здесь — меняется " +
    "на всех страницах, где стоит этот блок.",
  fields: [
    defineField({
      name: "title",
      title: "Название для списка",
      type: "string",
      description: "Видно только в админке, например «Видеоотзывы, RU»",
      validation: Rule => Rule.required()
    }),

    defineField({
      name: "heading",
      title: "Заголовок блока",
      type: "string",
      description: "Выводится заголовком второго уровня"
    }),

    defineField({
      name: "videos",
      title: "Видео",
      type: "array",
      of: [{ type: "videoItem" }],
      validation: Rule => Rule.min(1).error("Добавьте хотя бы одно видео")
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

export default videoReviewsDocument;
