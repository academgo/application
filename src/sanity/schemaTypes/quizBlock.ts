// schemaTypes/quizBlock.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "quizBlock",
  title: "Quiz Block",
  type: "object",
  fields: [
    defineField({
      name: "finalTitle",
      title: "Final Title",
      type: "string",
      description: "Title on the last step (WhatsApp step)"
    }),
    defineField({
      name: "formTitle",
      title: "Form Title",
      type: "string",
      description: "Text above the phone input on the last step"
    }),
    defineField({
      name: "inputLabel",
      title: "Input Label",
      type: "string",
      description: "Label for WhatsApp phone input"
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      description: "Submit button text on the last step"
    }),

    defineField({
      name: "questions",
      title: "Questions (steps after the first fixed question)",
      type: "array",
      of: [{ type: "quizQuestion" }],
      validation: Rule => Rule.min(1).error("Add at least 1 question")
    })
  ]
});
