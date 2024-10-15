import { defineType, defineField } from "sanity";

const benefitsBlock = defineType({
  name: "benefitsBlock",
  title: "Benefits Block",
  type: "object",
  fields: [
    defineField({
      name: "titleHighLight",
      title: "Title Highlight",
      type: "string"
    }),
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
      name: "benefitsBullets",
      title: "Benefits Bullets",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "bulletIcon",
              title: "Bullet Icon",
              type: "image"
            }),
            defineField({
              name: "bulletTitle",
              title: "Bullet Title",
              type: "string"
            }),
            defineField({
              name: "bulletText",
              title: "Bullet Text",
              type: "string"
            })
          ]
        }
      ]
    })
  ]
});

export default benefitsBlock;
