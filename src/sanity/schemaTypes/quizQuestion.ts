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
      name: "options",
      title: "Options",
      type: "array",
      of: [{ type: "quizOption" }],
      validation: Rule => Rule.min(2).error("Add at least 2 options")
    })
  ]
});
