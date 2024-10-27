import { defineType, defineField } from "sanity";

const logosBlock = defineType({
  name: "logosBlock",
  title: "Logos Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "University Name",
              type: "string"
            }),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image"
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string"
            })
          ]
        }
      ]
    })
  ]
});

export default logosBlock;
