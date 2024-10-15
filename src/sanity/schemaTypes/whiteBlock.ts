import { defineType, defineField } from "sanity";

const whiteBlock = defineType({
  name: "whiteBlock",
  title: "White Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title (optional)",
      type: "string",
      description:
        "This title will be displayed above the text blocks. If you don't need it, just leave it empty."
    }),
    defineField({
      name: "text",
      title: "Text (optional)",
      type: "contentBlock"
    }),
    defineField({
      name: "bullets",
      title: "Bullets",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Number",
              type: "string"
            }),
            defineField({
              name: "sign",
              title: "Sign",
              type: "string"
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "string"
            })
          ]
        }
      ]
    })
  ]
});

export default whiteBlock;
