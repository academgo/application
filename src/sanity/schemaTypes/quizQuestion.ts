// schemaTypes/quizQuestion.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "quizQuestion",
  title: "Quiz Question",
  type: "object",
  fields: [
    defineField({
      name: "questionTitle",
      title: "Question Title",
      type: "string",
      validation: Rule => Rule.required()
    }),

    defineField({
      name: "optionsSource",
      title: "Where options come from",
      type: "string",
      initialValue: "manual",
      options: {
        list: [
          { title: "Свои варианты (ниже)", value: "manual" },
          { title: "Список стран обучения", value: "countries" }
        ],
        layout: "radio"
      },
      description:
        "«Список стран обучения» подставляет страны из раздела Country — новая страна появится в квизе сама."
    }),

    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [{ type: "quizOption" }],
      hidden: ({ parent }: any) => parent?.optionsSource === "countries",
      validation: Rule =>
        Rule.custom((options: any[] | undefined, context: any) => {
          if (context.parent?.optionsSource === "countries") return true;
          return (options?.length || 0) >= 2 ? true : "Add at least 2 options";
        })
    }),

    defineField({
      name: "extraOption",
      title: "Extra option for the countries list",
      type: "string",
      hidden: ({ parent }: any) => parent?.optionsSource !== "countries",
      description:
        "Добавляется последним вариантом, например «Ещё не выбрал(а)»"
    })
  ]
});
