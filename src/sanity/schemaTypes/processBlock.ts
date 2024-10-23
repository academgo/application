import { defineType, defineField } from "sanity";

const processBlock = defineType({
  name: "processBlock",
  title: "Process Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string"
    }),
    defineField({
      name: "items",
      title: "Items",
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
              name: "content",
              title: "Content",
              type: "blockContentWithStyle"
            })
          ]
        }
      ]
    })
  ]
});

export default processBlock;
