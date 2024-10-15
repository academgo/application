import { defineType, defineField } from "sanity";

const linksBlock = defineType({
  name: "linksBlock",
  title: "Links Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string"
            }),
            defineField({
              name: "destination",
              title: "Destination",
              type: "string"
            })
          ]
        }
      ]
    })
  ]
});

export default linksBlock;
