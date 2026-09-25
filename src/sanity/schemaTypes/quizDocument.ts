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
        "Панель справа от квиза на десктопе: что человек получит, кто ответит, мессенджеры. Пустая — квиз показывается без панели.",
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
          description: "Строка под заголовком: «5 вопросов · около 2 минут»"
        }),
        defineField({
          name: "teamTitle",
          title: "Team title",
          type: "string"
        }),
        defineField({
          name: "team",
          title: "Team",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({
                  name: "position",
                  title: "Position",
                  type: "string"
                }),
                defineField({ name: "photo", title: "Photo", type: "image" })
              ],
              preview: {
                select: { title: "name", subtitle: "position", media: "photo" }
              }
            }
          ]
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
