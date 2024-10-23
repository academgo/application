import { defineType, defineField } from "sanity";

const compareBlock = defineType({
  name: "compareBlock",
  title: "Compare Block",
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
      name: "link",
      title: "Link",
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
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image"
    })
  ]
});

export default compareBlock;
