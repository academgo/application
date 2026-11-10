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
    }),

    defineField({
      name: "image",
      title: "Картинка варианта",
      type: "image",
      options: { hotspot: true },
      description:
        "Необязательно. Если заполнить, вариант показывается картинкой с подписью под ней. " +
        "Картинки лучше ставить либо у всех вариантов вопроса, либо ни у одного."
    })
  ],
  preview: {
    select: { title: "label", media: "image" }
  }
});
