import { defineType, defineField } from "sanity";

const bulletsBlock = defineType({
  name: "bulletsBlock",
  title: "Bullets Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
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

export default bulletsBlock;
