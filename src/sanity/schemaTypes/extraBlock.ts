import { defineType, defineField } from "sanity";

const extraBlock = defineType({
  name: "extraBlock",
  title: "Extra Block",
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
              name: "title",
              title: "Title",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "bgImage",
      title: "Background Image",
      type: "image"
    })
  ]
});

export default extraBlock;
