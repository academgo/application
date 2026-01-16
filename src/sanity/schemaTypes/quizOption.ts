// schemaTypes/quizOption.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "quizOption",
  title: "Quiz Option",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: { title: "label" }
  }
});
