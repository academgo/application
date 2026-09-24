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
