import { defineField } from "sanity";

const quizDocument = {
  name: "quizDocument",
  title: "Quiz",
  type: "document",
  description:
    "Квиз-анкета. Один документ на язык: меняете вопросы здесь — они меняются на всех страницах, где стоит блок опроса.",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Для списка документов: «Квиз по странам, RU»"
    }),
    defineField({
      name: "quiz",
      title: "Questions",
      type: "quizBlock"
    }),
    defineField({
      name: "sidebar",
      title: "Sidebar",
      type: "object",
      description:
        "Панель рядом с квизом на десктопе: что даст анкета и мессенджеры. Заполнена — на новых страницах квиз показывается новым блоком в две колонки.",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "bullets",
          title: "What you get",
          type: "array",
          of: [{ type: "string" }],
          description:
            "3–4 коротких пункта — только то, что квиз действительно даёт"
        }),
        defineField({
          name: "meta",
          title: "Meta line",
          type: "string",
          description:
            "Строка под заголовком: «5 вопросов · около 2 минут · бесплатно»"
        }),
        defineField({
          name: "contactsText",
          title: "Messengers text",
          type: "string"
        }),
        defineField({
          name: "contactLinks",
          title: "Messengers",
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
      ]
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

export default quizDocument;
